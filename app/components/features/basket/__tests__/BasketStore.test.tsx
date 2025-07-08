import { useBasketStore } from "@/store";
import { BasketItem } from "@/store";
describe("Basket Store Business Logic", () => {
  afterEach(() => {
    useBasketStore.setState({ basket: [] });
  });
  test("adds duplicate items by increasing quantity, not item count", () => {
    const product = { _id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product as BasketItem);
    useBasketStore.getState().addItem(product as BasketItem);
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });
  test("removing item completely clears it from basket", () => {
    const product = { _id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product as BasketItem);
    useBasketStore.getState().removeItem(product._id);
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(0);
  });
  test("quantity cannot be decreased below 1", () => {
    const product = { _id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product as BasketItem);
    useBasketStore.getState().updateQuantity(product._id, 0);
    const items = useBasketStore.getState().basket;
    expect(items[0].quantity).toBe(1);
  });
  test("basket calculates correct total for multiple items", () => {
    const productA = { _id: "audio-1", name: "Headphones", price: 100 };
    const productB = { _id: "audio-2", name: "Speakers", price: 50 };
    useBasketStore.getState().addItem(productA as BasketItem);
    useBasketStore.getState().addItem(productA as BasketItem);
    useBasketStore.getState().addItem(productB as BasketItem);
    const total = useBasketStore.getState().getTotal();
    expect(total).toBe(250);
  });
  test("checkout enabled only when basket has items", () => {
    expect(useBasketStore.getState().isCheckoutEnabled()).toBe(false);
    const product = { _id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product as BasketItem);
    expect(useBasketStore.getState().isCheckoutEnabled()).toBe(true);
  });
  test("invalid product data doesn't crash basket", () => {
    expect(() => {
      useBasketStore
        .getState()
        .addItem({ invalid: "data" } as unknown as BasketItem);
    }).not.toThrow();
    const items = useBasketStore.getState().basket ?? [];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(0);
  });
});
