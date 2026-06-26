export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  description: string;
  address: string;
  menu: Dish[];
}
