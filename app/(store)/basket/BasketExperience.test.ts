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
});
