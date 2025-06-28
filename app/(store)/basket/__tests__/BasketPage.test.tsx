import { render, screen } from "@testing-library/react";
import BasketPage from "../page";

jest.mock("@/store", () => ({
  useBasketStore: jest.fn(),
}));

import { useBasketStore } from "@/store";
const mockUseBasketStore = useBasketStore as jest.MockedFunction<
  typeof useBasketStore
>;

describe("1. Page Load & Initial State", () => {
  describe("1.1 Empty Basket State", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Empty basket displays browse products message", () => {
      const mockStore = {
        basket: [],
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        getTotal: jest.fn(() => 0),
        isCheckoutEnabled: jest.fn(() => false),
      };

      mockUseBasketStore.mockImplementation((selector) => {
        return selector ? selector(mockStore) : mockStore;
      });

      render(<BasketPage />);

      expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
    });
  });

  describe("1.2 Populated Basket State", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Basket displays all items with correct information", () => {
      const mockProducts = [
        {
          id: "1",
          name: "Test Product 1",
          price: 249.99,
          quantity: 2,
        },
        {
          id: "2",
          name: "Test Product 2",
          price: 149.99,
          quantity: 1,
        },
      ];

      const mockStore = {
        basket: mockProducts,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        getTotal: jest.fn(() => 649.97),
        isCheckoutEnabled: jest.fn(() => true),
      };

      mockUseBasketStore.mockImplementation((selector) => {
        return selector ? selector(mockStore) : mockStore;
      });

      render(<BasketPage />);

      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.getAllByText("$249.99")).toHaveLength(2);
      expect(screen.getAllByText("$149.99")).toHaveLength(2);
      expect(screen.getByText("$649.97")).toBeInTheDocument();
      expect(screen.getByText("$15.99")).toBeInTheDocument();
      expect(screen.getByText("$665.96")).toBeInTheDocument();
      expect(screen.getByText("Proceed to Checkout")).toBeInTheDocument();
    });
  });
});
