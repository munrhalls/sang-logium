export type ServerProduct = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  stripePriceId: string;
  _rev: string;
};

export type PublicBasketItem = {
  _id: string;
  quantity: number;
};
