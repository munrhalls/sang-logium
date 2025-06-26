import { useStore } from "@/store";

describe("Basket Store Business Logic", () => {
  afterEach(() => {
    useStore.setState({ basket: [] });
  });

  test("adds duplicate items by increasing quantity, not item count", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useStore.getState().addItem(product);
    useStore.getState().addItem(product);
    const items = useStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  test("removing item completely clears it from basket", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useStore.getState().addItem(product);
    useStore.getState().removeItem(product.id);
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
  });

  test("quantity cannot be decreased below 1", () => {
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useStore.getState().addItem(product);
    useStore.getState().updateQuantity(product.id, 0);
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(1);
  });

  test("basket calculates correct total for multiple items", () => {
    const productA = { id: "audio-1", name: "Headphones", price: 100 };
    const productB = { id: "audio-2", name: "Speakers", price: 50 };
    useStore.getState().addItem(productA);
    useStore.getState().addItem(productA);
    useStore.getState().addItem(productB);
    const total = useStore.getState().getTotal();
    expect(total).toBe(250);
  });

  test("checkout enabled only when basket has items", () => {
    expect(useStore.getState().isCheckoutEnabled()).toBe(false);
    const product = { id: "audio-1", name: "Headphones", price: 100 };
    useStore.getState().addItem(product);
    expect(useStore.getState().isCheckoutEnabled()).toBe(true);
  });

  test("invalid product data doesn't crash basket", () => {
    expect(() => {
      // @ts-expect-error purposely passing invalid data
      useStore.getState().addItem({ invalid: "data" });
    }).not.toThrow();
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
  });
});
