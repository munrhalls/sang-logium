import { render, screen } from "@testing-library/react";
import BasketPage from "../page";

jest.mock("@/stores/basket-store", () => ({
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
      mockUseBasketStore.mockReturnValue({
        items: [],
        totalItems: 0,
        total: 0,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearBasket: jest.fn(),
      });

      render(<BasketPage />);

      expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /browse products/i })
      ).toBeInTheDocument();
      expect(screen.queryByText("Order Summary")).not.toBeInTheDocument();
    });
  });
});
