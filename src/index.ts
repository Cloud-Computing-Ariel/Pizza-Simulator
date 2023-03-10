import { Kafka } from 'kafkajs';

import { RestaurantFactory } from './restaurant';
import { OrderFactory } from './order';
import { getRandomNumber } from './helper';

const kafka = new Kafka({
  clientId: 'pizza',
  brokers: ['localhost:9092'],
});

async function runSimultaion() {
  const producer = kafka.producer();
  console.log('Connecting to kafka...');
  await producer.connect();
  console.log('Connected to kafka...');
  const restaurantFactory: RestaurantFactory = new RestaurantFactory();
  const orderFactory: OrderFactory = new OrderFactory(restaurantFactory);
  console.log('Simultaion Running...');
  // here we open new orders
  setInterval(async () => {
    let newOrder = orderFactory.getNewOrder(getRandomNumber(0, 10));
    if (newOrder) {
      await producer.send({
        topic: 'new-order',
        messages: [{ value: JSON.stringify(newOrder) }],
      });
      console.log('Opened new order: ', newOrder);
    }
  }, 1000 * getRandomNumber(10, 20));

  // here we close open orders
  setInterval(async () => {
    let order = orderFactory.getRandomOpenOrder();
    if (order) {
      const randomElapedTime = new Date(order.order.statusTime.getTime() + 1000 * getRandomNumber(30, 100));
      const t = new Date();
      if (randomElapedTime <= t) {
        orderFactory.closeOrderById(order.order.id);
        await producer.send({
          topic: 'order-status-change',
          messages: [{ value: JSON.stringify(order) }],
        });
        console.log('Closed order: ', order);
      }
    }
  }, 500);

  // here we open new restaurants
  setInterval(async () => {
    let newRestaurnt = restaurantFactory.getNewRestaurant();
    if (newRestaurnt) {
      await producer.send({
        topic: 'restaurant-status-change',
        messages: [{ value: JSON.stringify(newRestaurnt) }],
      });
      console.log('Opened new restaurant: ', newRestaurnt);
    }
  }, 1000 * getRandomNumber(20, 40));

  // here we close random restaurant
  setTimeout(() => {
    setInterval(async () => {
      let closedRestaurnt = restaurantFactory.closeRandomRestaurant();
      if (closedRestaurnt) {
        await producer.send({
          topic: 'restaurant-status-change',
          messages: [{ value: JSON.stringify(closedRestaurnt) }],
        });
        console.log('Closed restaurant: ', closedRestaurnt);
      }
    }, 1000 * getRandomNumber(60, 120));
  }, 1000 * 120);
  // console.log('Disconnecting from kafka...');
  // await producer.disconnect();
}

runSimultaion();
