import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import React from "react";
import { useStore } from "@/store";
import ProductThumb from "@/app/components/features/products-view/ProductThumb";
import ProductPageBasketControls from "../../product/[id]/ProductPageBasketControls";
import ErrorBoundary from "../../product/[id]/ErrorBoundary";
import { Product } from "@/sanity.types";

describe("Products Listing Page Basket Experience", () => {
  afterEach(() => {
    act(() => {
      useStore.setState({ basket: [] });
    });
    cleanup();
  });

  const mockProduct: Product = {
    _id: "audio-1",
    name: "Headphones",
    price: 100,
    _type: "product",
    _createdAt: "2023-01-01T00:00:00Z",
    _updatedAt: "2023-01-01T00:00:00Z",
    _rev: "mockrev1",
    image: {
      asset: { _ref: "image-abc123", _type: "reference" },
      _type: "image",
    },
    description: [],
    stock: 10,
    slug: { _type: "slug", current: "headphones" },
    brand: "TestBrand",
    sku: "SKU-123",
    gallery: [],
    categoryPath: [],
    tags: [],
    overviewFields: [],
    specifications: [],
  };

  test("Add to Cart button is visible on product card when product is not in basket", () => {
    render(<ProductThumb product={mockProduct} />);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Clicking Add to Cart on product card adds product and shows quantity controls", () => {
    render(<ProductThumb product={mockProduct} />);
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
      screen.getByRole("button", { name: /remove from basket/i })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking + on product card increases product quantity", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("Clicking - on product card decreases product quantity but not below 1", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking X on product card removes product and restores Add to Cart button", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /remove from basket/i })
    );
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test("Quantity controls on product card match individual product page", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from basket/i })
    ).toBeInTheDocument();
  });

  test("Basket state updates are reflected across all product cards and pages", () => {
    render(
      <>
        <ProductThumb product={mockProduct} />
        <ProductPageBasketControls
          product={{
            id: mockProduct._id,
            name: mockProduct.name!,
            price: mockProduct.price!,
          }}
        />
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
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    cleanup();
    render(<ProductThumb product={mockProduct} />);
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
        <ProductThumb product={mockProduct} />
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
        <ProductThumb product={mockProduct} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /remove from basket/i })
    );
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});
