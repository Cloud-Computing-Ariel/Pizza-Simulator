import { statusType } from './helper';

export interface Restaurant {
  id: number;
  city: string;
  region: string;
  status: statusType;
}

export class RestaurantFactory {
  private currentRestaurantId = 0;
  private openRestaurnts: Restaurant[] = [] as Restaurant[];
  private closedRestaurnts: Restaurant[] = [] as Restaurant[];
  readonly REGIONS: { region: string; cities: string[] }[] = [
    { region: 'Dan', cities: ['Hod Hasharon', 'Petah Tikvah', "Ra'anana"] },
    { region: 'Center', cities: ['Tel Aviv', 'Bat Yam', 'Ramat Gan'] },
    { region: 'South', cities: ['Dimona', 'Eilat', "Be'er Sheva"] },
    { region: 'North', cities: ['Afula', 'Haifa', 'Tveria'] },
  ];

  public getNewRestaurant(): Restaurant | undefined {
    const allCitiesSum = this.REGIONS.reduce((prev: number, region: { region: string; cities: string[] }) => {
      return prev + region.cities.length;
    }, 0);
    if (allCitiesSum <= this.openRestaurnts.length) return undefined;
    this.currentRestaurantId += 1;
    const [region, city] = this.getRandomRegionAndCity();
    const newRestaurnt: Restaurant = {
      id: this.currentRestaurantId,
      city: city,
      region: region,
      status: 'open',
    };
    this.openRestaurnts.push(newRestaurnt);
    return newRestaurnt;
  }

  public closeRandomRestaurant(): Restaurant | undefined {
    const randomOpenRestaurant: Restaurant | undefined = this.getRandomOpenRestaurant();
    if (!randomOpenRestaurant) return undefined;
    this.openRestaurnts = this.openRestaurnts.filter(
      (restaurant: Restaurant) => restaurant.id !== randomOpenRestaurant.id
    );
    randomOpenRestaurant.status = 'closed';
    this.closedRestaurnts.push(randomOpenRestaurant);
    return randomOpenRestaurant;
  }

  public getRandomOpenRestaurant(): Restaurant | undefined {
    if (!this.openRestaurnts.length) return undefined;
    return this.openRestaurnts[Math.floor(Math.random() * this.openRestaurnts.length)];
  }

  public getAllOpenRestaurnts(): Restaurant[] {
    return [...this.openRestaurnts];
  }

  private getRandomRegionAndCity(): [string, string] {
    let randomRegion: { region: string; cities: string[] };
    let randomCity: string;
    let maxIterTime = 0;
    do {
      randomRegion = this.REGIONS[Math.floor(Math.random() * this.REGIONS.length)];
      randomCity = randomRegion.cities[Math.floor(Math.random() * randomRegion.cities.length)];
      maxIterTime++;
    } while (
      this.openRestaurnts.find((restaurant) => {
        return restaurant.city === randomCity;
      }) &&
      this.closedRestaurnts.find((restaurant) => restaurant.city === randomCity) &&
      maxIterTime < 10
    );
    return [randomRegion.region, randomCity];
  }
}
