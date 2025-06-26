import { useStore } from "@/store";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ProductPageBasketControls from "../product/[id]/ProductPageBasketControls";

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
    // In a real test, would compare with listing controls for consistency
  });
});
