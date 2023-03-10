import { statusType } from './helper';
import { RestaurantFactory } from './restaurant';

export interface Order {
  restaurantId: number;
  restaurantCity: string;
  restaurantRegion: string;
  order: {
    id: number;
    status: statusType;
    statusTime: Date;
    toppings: string[];
  };
}

export class OrderFactory {
  constructor(private restaurantFactory: RestaurantFactory) {}
  private currentOrderId = 0;
  private openOrders: Order[] = [] as Order[];
  private readonly TOPPINGS: string[] = [
    'Onions',
    'Mushrooms',
    'Pepperoni',
    'Sausage',
    'Extra Cheese',
    'Green Pepper',
    'Tomato',
    'Bacon',
    'Corn',
    'Pineapple',
  ];

  public getNewOrder(toppingsQuantity: number): Order | undefined {
    if (!this.restaurantFactory.getAllOpenRestaurnts().length || toppingsQuantity > this.TOPPINGS.length)
      return undefined;
    this.currentOrderId += 1;
    const newRestaurnt = this.restaurantFactory.getRandomOpenRestaurant();
    if (!newRestaurnt) return undefined;
    const newOrder: Order = {
      restaurantId: newRestaurnt.id || -1,
      restaurantCity: newRestaurnt.city || 'NO OPEN RESTAURANT FOUND, THIS IS A BUG, PLEASE ALERT ALEX',
      restaurantRegion: newRestaurnt.region || 'NO OPEN RESTAURANT FOUND, THIS IS A BUG, PLEASE ALERT ALEX',
      order: {
        id: this.currentOrderId,
        status: 'open',
        statusTime: new Date(),
        toppings: this.getRandomToppings(toppingsQuantity),
      },
    };
    this.openOrders.push(newOrder);
    return newOrder;
  }

  public closeRandomOrder(): Order | undefined {
    const randomOpenOrder: Order | undefined = this.getRandomOpenOrder();
    if (!randomOpenOrder) return undefined;

    this.openOrders = this.openOrders.filter((order: Order) => order.order.id !== randomOpenOrder.order.id);
    randomOpenOrder.order.status = 'closed';
    randomOpenOrder.order.statusTime = new Date();
    return randomOpenOrder;
  }

  public closeOrderById(id: number): Order | undefined {
    const openOrder: Order | undefined = this.openOrders.find((order: Order) => order.order.id === id);
    if (!openOrder) return undefined;
    this.openOrders = this.openOrders.filter((order: Order) => order.order.id !== openOrder.order.id);
    openOrder.order.status = 'closed';
    openOrder.order.statusTime = new Date();
    return openOrder;
  }

  public getAllOpenOrders(): Order[] {
    return [...this.openOrders];
  }

  private getRandomToppings(quantity: number): string[] {
    const toppingToReturn: string[] = [];
    let maxIterTime = 0;
    for (let i = 0; i < quantity; i++) {
      let topping: string;
      maxIterTime++;
      do topping = this.TOPPINGS[Math.floor(Math.random() * this.TOPPINGS.length)];
      while (toppingToReturn.includes(topping) && maxIterTime < 10);
      toppingToReturn.push(topping);
    }
    return toppingToReturn;
  }

  public getRandomOpenOrder(): Order | undefined {
    if (!this.openOrders.length) return undefined;
    return this.openOrders[Math.floor(Math.random() * this.openOrders.length)];
  }
}
