import { render, screen, cleanup } from "@testing-library/react";
import { useStore } from "@/store";

import ProductThumb from "@/app/components/features/products-view/ProductThumb";
import ProductPageBasketControls from "@/app/(store)/product/[id]/ProductPageBasketControls";

jest.mock("../../../../store", () => {
  const actual = jest.requireActual("../../../../store");
  return {
    ...actual,
    useStore: jest.fn(),
  };
});

describe("Product Listing Basket Experience", () => {
  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ basket: [] })
    );
  });

  it("Add to Cart button is visible on product card when product is not in basket", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    render(<ProductThumb product={product as any} />);
    const addToCartButton = screen.getByRole("button", {
      name: /add to basket/i,
    });
    expect(addToCartButton).toBeInTheDocument();
  });

  it("Add to Cart button is not visible and quantity controls are visible when product is in basket", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 2 },
        ],
      })
    );
    render(<ProductThumb product={product as any} />);
    const addToCartButton = screen.queryByRole("button", {
      name: /add to basket/i,
    });
    expect(addToCartButton).not.toBeInTheDocument();
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
  });

  it("Clicking + on product card increases product quantity", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    const updateQuantity = jest.fn();
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 1 },
        ],
        updateQuantity,
      })
    );
    render(<ProductThumb product={product as any} />);
    const increaseButton = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    increaseButton.click();
    expect(updateQuantity).toHaveBeenCalledWith("audio-1", 2);
  });

  it("Clicking - on product card decreases product quantity", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    const updateQuantity = jest.fn();
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 2 },
        ],
        updateQuantity,
      })
    );
    render(<ProductThumb product={product as any} />);
    const decreaseButton = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    decreaseButton.click();
    expect(updateQuantity).toHaveBeenCalledWith("audio-1", 1);
  });

  it("Quantity cannot decrease below 1 via - button", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    const updateQuantity = jest.fn();
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 1 },
        ],
        updateQuantity,
      })
    );
    render(<ProductThumb product={product as any} />);
    const decreaseButton = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    decreaseButton.click();
    expect(updateQuantity).not.toHaveBeenCalled();
    expect(decreaseButton).toBeDisabled();
  });

  it("Clicking X on product card removes product and restores Add to Cart button", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    const removeItem = jest.fn();
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 2 },
        ],
        removeItem,
      })
    );
    const { rerender } = render(<ProductThumb product={product as any} />);
    const removeButton = screen.getByRole("button", {
      name: /remove from basket/i,
    });
    removeButton.click();
    expect(removeItem).toHaveBeenCalledWith("audio-1");
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ basket: [], removeItem })
    );
    rerender(<ProductThumb product={product as any} />);
    const addToCartButton = screen.getByRole("button", {
      name: /add to basket/i,
    });
    expect(addToCartButton).toBeInTheDocument();
  });

  it("Clicking X on product card sets that product's quantity in basket to 0", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    const removeItem = jest.fn();
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 3 },
        ],
        removeItem,
      })
    );
    render(<ProductThumb product={product as any} />);
    const removeButton = screen.getByRole("button", {
      name: /remove from basket/i,
    });
    removeButton.click();
    expect(removeItem).toHaveBeenCalledWith("audio-1");
  });

  it("Product card quantity controls render with same structure as individual product page", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 2 },
        ],
      })
    );
    render(<ProductThumb product={product as any} />);
    expect(
      screen.getByRole("button", { name: /increase quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove from basket/i })
    ).toBeInTheDocument();
    cleanup();
    render(
      <ProductPageBasketControls
        product={{ id: "audio-1", name: "Headphones", price: 100 }}
      />
    );
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

  it("Product card reflects basket state changes made elsewhere", () => {
    const product = {
      _id: "audio-1",
      name: "Headphones",
      price: 100,
      image: {
        asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
      },
      stock: 5,
    };
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 1 },
        ],
      })
    );
    const { rerender } = render(<ProductThumb product={product as any} />);
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        basket: [
          { id: "audio-1", name: "Headphones", price: 100, quantity: 3 },
        ],
      })
    );
    rerender(<ProductThumb product={product as any} />);
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
});
