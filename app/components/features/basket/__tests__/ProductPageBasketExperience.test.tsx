import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { useBasketStore } from "@/store/store";
import BasketControls from "@/app/components/features/basket/BasketControls";
describe("Individual Product Page Basket Experience", () => {
  afterEach(() => {
    act(() => {
      useBasketStore.setState({ basket: [] });
    });
  });
  const mockProduct = {
    _id: "audio-1",
    name: "Headphones",
    price: 100,
    stock: 5,
    quantity: 3,
  };
  test("Add to Cart button is visible when product is not in basket", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeInTheDocument();
  });
  test("Clicking Add to Cart adds product and shows quantity controls", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    });
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(
      screen.getByRole("button", {
        name: /increase quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /decrease quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /remove from basket/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
  test("Clicking + increases product quantity", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /increase quantity/i,
        })
      );
    });
    const items = useBasketStore.getState().basket;
    expect(items[0].quantity).toBe(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
  test("Clicking - decreases product quantity but not below 1", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /increase quantity/i,
        })
      );
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /decrease quantity/i,
        })
      );
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /decrease quantity/i,
        })
      );
    });
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", {
        name: /show basket controls/i,
      })
    ).toBeInTheDocument();
  });
  test("Clicking X removes product and restores Add to Cart button", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /remove from basket/i,
        })
      );
    });
    const items = useBasketStore.getState().basket;
    expect(items.length).toBe(0);
    expect(
      screen.getByRole("button", {
        name: /show basket controls/i,
      })
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: /show basket controls/i,
      })
    );
    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeInTheDocument();
  });
  test("Quantity controls match product listing behavior", () => {
    render(<BasketControls product={mockProduct} />);
    const showControlsButton = screen.getByRole("button", {
      name: /show basket controls/i,
    });
    fireEvent.click(showControlsButton);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    });
    expect(
      screen.getByRole("button", {
        name: /increase quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /decrease quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /remove from basket/i,
      })
    ).toBeInTheDocument();
  });
});
