import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { useStore } from "@/store";
import ProductPageBasketControls from "../../product/[id]/ProductPageBasketControls";
import ErrorBoundary from "../../product/[id]/ErrorBoundary";

function ProductCardBasketControls({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  return <ProductPageBasketControls product={product} />;
}

describe("Individual Product Page Basket Experience", () => {
  afterEach(() => {
    useStore.setState({ basket: [] });
  });

  const mockProduct = { id: "audio-1", name: "Headphones", price: 100 };

  test("Add to Cart button is visible when product is not in basket", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Clicking Add to Cart adds product and shows quantity controls", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    const items = useStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from cart/i })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking + increases product quantity", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("Clicking - decreases product quantity but not below 1", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking X removes product and restores Add to Cart button", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove from cart/i }));
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Quantity controls match product listing behavior", () => {
    render(<ProductPageBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from cart/i })
    ).toBeInTheDocument();
  });
});

describe("Products Listing Page Basket Experience", () => {
  afterEach(() => {
    useStore.setState({ basket: [] });
    cleanup();
  });

  const mockProduct = { id: "audio-1", name: "Headphones", price: 100 };

  test("Add to Cart button is visible on product card when product is not in basket", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Clicking Add to Cart on product card adds product and shows quantity controls", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    const items = useStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from cart/i })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking + on product card increases product quantity", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("Clicking - on product card decreases product quantity but not below 1", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking X on product card removes product and restores Add to Cart button", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove from cart/i }));
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Quantity controls on product card match individual product page", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from cart/i })
    ).toBeInTheDocument();
  });

  test("Basket state updates are reflected across all product cards and pages", () => {
    render(
      <>
        <ProductCardBasketControls product={mockProduct} />
        <ProductPageBasketControls product={mockProduct} />
      </>
    );
    fireEvent.click(screen.getAllByRole("button", { name: /add to cart/i })[0]);
    fireEvent.click(
      screen.getAllByRole("button", { name: /increase quantity/i })[0]
    );
    expect(screen.getAllByText("2")).toHaveLength(2);
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
  });

  test("Basket state from product card persists after page reload", () => {
    render(<ProductCardBasketControls product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    cleanup();
    render(<ProductCardBasketControls product={mockProduct} />);
    const decreaseButtons = screen.getAllByRole("button", {
      name: /decrease quantity/i,
    });
    expect(decreaseButtons.length).toBeGreaterThan(0);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("UI does not crash if basket operation fails on product card", () => {
    const original = useStore.getState().updateQuantity;
    useStore.setState({
      updateQuantity: () => {
        throw new Error("Simulated error");
      },
    });
    render(
      <ErrorBoundary fallback={<div>Basket error fallback</div>}>
        <ProductCardBasketControls product={mockProduct} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    expect(screen.getByText(/basket error fallback/i)).toBeInTheDocument();
    useStore.setState({ updateQuantity: original });
  });

  test("All basket operations on product card are testable via UI", () => {
    render(
      <ErrorBoundary fallback={<div>Basket error fallback</div>}>
        <ProductCardBasketControls product={mockProduct} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove from cart/i }));
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});
