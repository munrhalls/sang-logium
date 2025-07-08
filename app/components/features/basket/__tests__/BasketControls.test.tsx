import { render, screen, fireEvent } from "@testing-library/react";
import BasketControls from "@/app/components/features/basket/BasketControls";
import { useBasketStore } from "@/store";
describe("BasketControls: Increment and decrement from Cart", () => {
  beforeEach(() => {
    useBasketStore.getState().basket = [];
  });
  it("User adds a product to the basket from any context", () => {
    const product = { _id: "p1", name: "Test Product", stock: 5, price: 100 };
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem).toBeTruthy();
    expect(basketItem?.quantity).toBe(1);
    expect(
      screen.getByRole("button", { name: /increase quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
  it("User increases quantity of a product in the basket up to available stock", () => {
    const product = { _id: "p2", name: "Stock Product", stock: 3, price: 50 };
    useBasketStore.getState().basket = [{ ...product, quantity: 2 }];
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const incBtn = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(incBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem?.quantity).toBe(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
  it("User cannot increase quantity above available stock", () => {
    const product = { _id: "p2", name: "Stock Product", stock: 3, price: 50 };
    useBasketStore.getState().basket = [{ ...product, quantity: 3 }];
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const incBtn = screen.getByRole("button", { name: /increase quantity/i });
    fireEvent.click(incBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem?.quantity).toBe(3);
    expect(incBtn).toBeDisabled();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
  it("User decreases quantity of a product in the basket", () => {
    const product = {
      _id: "p3",
      name: "Decrement Product",
      stock: 10,
      price: 20,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 3 }];
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const decBtn = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem?.quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
  it("User removes product by decrementing to zero", () => {
    const product = {
      _id: "p3",
      name: "Decrement Product",
      stock: 10,
      price: 20,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 1 }];
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const decBtn = screen.getByRole("button", { name: /decrease quantity/i });
    fireEvent.click(decBtn);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem).toBeUndefined();
    expect(
      screen.getByRole("button", { name: /show basket controls/i }),
    ).toBeInTheDocument();
  });
  it("Controls look and behave the same in all contexts", () => {
    const product = {
      _id: "p5",
      name: "Consistent Product",
      stock: 10,
      price: 99,
    };
    useBasketStore.getState().basket = [{ ...product, quantity: 2 }];
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    expect(
      screen.getByRole("button", { name: /increase quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from basket/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
  it("Product with _id is correctly added to the basket as id", () => {
    const product = {
      _id: "mongo123",
      name: "Sanity Product",
      stock: 7,
      price: 150,
    };
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);
    const basket = useBasketStore.getState().basket;
    const basketItem = basket.find((item) => item._id === product._id);
    expect(basketItem).toBeTruthy();
    expect(basketItem?.quantity).toBe(1);
    expect(basketItem?.name).toBe("Sanity Product");
    expect(basketItem?.price).toBe(150);
    expect(
      screen.getByRole("button", { name: /increase quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
  it("Clicking the button activates render of the inner buttons component, which is hidden by default", () => {
    const product = {
      _id: "spec1",
      name: "Spec Product",
      stock: 5,
      price: 100,
    };
    render(<BasketControls product={product} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /increase quantity/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /decrease quantity/i }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(
      screen.getByRole("button", { name: /increase quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i }),
    ).toBeInTheDocument();
  });
});
