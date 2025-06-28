import { useUIStore } from "@/store";

describe("Basket Store Business Logic", () => {
  afterEach(() => {
    useBasketStore.setState({ basket: [] });
  });

  test("adds duplicate items by increasing quantity, not item count", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product);
    useBasketStore.getState().addItem(product);
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  test("removing item completely clears it from basket", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product);
    useBasketStore.getState().removeItem(product.id);
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(0);
  });

  test("quantity cannot be decreased below 1", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product);
    useBasketStore.getState().updateQuantity(product.id, 0);
    const items = useBasketStore.getState().basket;
    expect(items[0].quantity).toBe(1);
  });

  test("basket calculates correct total for multiple items", () => {
    const productA = { id: "audio-1", name: "Headphones", price: 100 };
    const productB = { id: "audio-2", name: "Speakers", price: 50 };
    useBasketStore.getState().addItem(productA);
    useBasketStore.getState().addItem(productA);
    useBasketStore.getState().addItem(productB);
    const total = useBasketStore.getState().getTotal();
    expect(total).toBe(250);
  });

  test("checkout enabled only when basket has items", () => {
    expect(useBasketStore.getState().isCheckoutEnabled()).toBe(false);
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useBasketStore.getState().addItem(product);
    expect(useBasketStore.getState().isCheckoutEnabled()).toBe(true);
  });

  test("invalid product data doesn't crash basket", () => {
    expect(() => {
      // @ts-expect-error purposely passing invalid data
      useBasketStore.getState().addItem({ invalid: "data" });
    }).not.toThrow();
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(0);
  });
});
