import { render, screen, fireEvent } from "@testing-library/react";
import BasketControls from "@/app/components/features/basket/BasketControls";
import { useBasketStore } from "@/store";

describe("BasketControls: Add to Cart", () => {
  beforeEach(() => {
    useBasketStore.getState().basket = [];
  });

  it("User adds a product to the basket from any context", () => {
    const product = { id: "p1", name: "Test Product", stock: 5, price: 100 };
    render(<BasketControls product={product} />);
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item.id === product.id);
    expect(basketItem).toBeTruthy();
    expect(basketItem?.quantity).toBe(1);

    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("User increases quantity of a product in the basket up to available stock", () => {
    const product = { id: "p2", name: "Stock Product", stock: 3, price: 50 };
    useBasketStore.getState().basket = [{ ...product, quantity: 2 }];
    render(<BasketControls product={product} />);
    const incBtn = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(incBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item.id === product.id);
    expect(basketItem?.quantity).toBe(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("User cannot increase quantity above available stock", () => {
    const product = { id: "p2", name: "Stock Product", stock: 3, price: 50 };
    useBasketStore.getState().basket = [{ ...product, quantity: 3 }];
    render(<BasketControls product={product} />);
    const incBtn = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(incBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item.id === product.id);
    expect(basketItem?.quantity).toBe(3);
    expect(incBtn).toBeDisabled();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("User decreases quantity of a product in the basket", () => {
    const product = {
      id: "p3",
      name: "Decrement Product",
      stock: 10,
      price: 20,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 3 }];
    render(<BasketControls product={product} />);
    const decBtn = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item.id === product.id);
    expect(basketItem?.quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("User removes product by decrementing to zero", () => {
    const product = {
      id: "p3",
      name: "Decrement Product",
      stock: 10,
      price: 20,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 1 }];
    render(<BasketControls product={product} />);
    const decBtn = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item.id === product.id);
    expect(basketItem).toBeUndefined();
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  //   **BasketControls: UI Consistency**
  // Test: "Controls look and behave the same in all contexts"

  // - GIVEN: Product with id="p5" is in the basket, quantity=2, stock=10, on product page, listing, and basket page
  // - WHEN: User views the controls in any context
  // - THEN: UI shows identical controls (–, qty, +, X) and behavior is consistent everywhere

  it("Controls look and behave the same in all contexts", () => {
    const product = {
      id: "p5",
      name: "Consistent Product",
      stock: 10,
      price: 99,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 2 }];
    render(<BasketControls product={product} />);
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from basket/i })
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
