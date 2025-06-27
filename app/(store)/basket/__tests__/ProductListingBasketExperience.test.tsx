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
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        _type: "reference",
      },
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
      screen.getByRole("button", { name: /add to basket/i })
    ).toBeInTheDocument();
  });

  test("Clicking Add to Cart on product card adds product and shows quantity controls", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
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
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("Clicking - on product card decreases product quantity but not below 1", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("Clicking X on product card removes product and restores Add to Cart button", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /remove from basket/i })
    );
    const items = useStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", { name: /add to basket/i })
    ).toBeInTheDocument();
  });

  test("Quantity controls on product card match individual product page", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
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
    fireEvent.click(
      screen.getAllByRole("button", { name: /add to basket/i })[0]
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: /increase quantity/i })[0]
    );
    expect(screen.getAllByText("2")).toHaveLength(2);
    const items = useStore.getState().basket;
    expect(items[0].quantity).toBe(2);
  });

  test("Basket state from product card persists after page reload", () => {
    render(<ProductThumb product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    cleanup();
    render(<ProductThumb product={mockProduct} />);
    const decreaseButtons = screen.getAllByRole("button", {
      name: /decrease quantity/i,
    });
    expect(decreaseButtons.length).toBeGreaterThan(0);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("UI gracefully handles basket operation errors without crashing", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const originalAddItem = useStore.getState().addItem;
    const originalUpdateQuantity = useStore.getState().updateQuantity;
    const originalRemoveItem = useStore.getState().removeItem;

    render(<ProductThumb product={mockProduct} />);

    useStore.setState({
      addItem: () => {
        throw new Error("Simulated add error");
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to add item to basket:",
      expect.any(Error)
    );

    useStore.setState({
      addItem: originalAddItem,
      updateQuantity: () => {
        throw new Error("Simulated update error");
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /add to basket/i }));
    fireEvent.click(screen.getByRole("button", { name: /increase quantity/i }));
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to increase quantity:",
      expect.any(Error)
    );

    useStore.setState({
      removeItem: () => {
        throw new Error("Simulated remove error");
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /remove from basket/i })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to remove item from basket:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  test("All basket operations on product card are testable via UI", () => {
    render(<ProductThumb product={mockProduct} />);

    const addButton = screen.getByRole("button", { name: /add to basket/i });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    const increaseButton = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    const decreaseButton = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    const removeButton = screen.getByRole("button", {
      name: /remove from basket/i,
    });

    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();

    fireEvent.click(increaseButton);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(decreaseButton);
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(removeButton);
    expect(
      screen.getByRole("button", { name: /add to basket/i })
    ).toBeInTheDocument();
  });
});
