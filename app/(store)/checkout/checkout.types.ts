export type ServerProduct = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  stripePriceId: string;
  _rev: string;
};

export type BasketCheckoutItem = {
  _id: string;
  quantity: number;
};
