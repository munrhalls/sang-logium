Basket Experience Specifications

1. Global State Management

- The basket must use a global state management solution (e.g., Zustand) to store and manage basket items.
- Basket state must persist across all pages and components in the app during a session.

2. Adding Items

- Users can add products to the basket from any product listing or product detail page.
- If a product is already in the basket, adding it again increases its quantity.

3. Removing Items

- Users can remove individual products from the basket.
- If a product's quantity is reduced to zero, it is removed from the basket.

4. Adjusting Quantity

- Users can increase or decrease the quantity of each product in the basket.
- Quantity cannot go below one.

5. Basket Display

- The basket page displays all items currently in the basket, including product name, brand, price, quantity, and subtotal.
- The basket page shows the total price, shipping cost, and final total.
- If the basket is empty, a clear message and a call-to-action to browse products are shown.

6. BasketButton

- The BasketButton in the header displays the current total number of items in the basket.
- The item count updates in real time as items are added or removed.

7. Checkout Integration

- The "Proceed to Checkout" button is enabled only if the basket has at least one item.
- Clicking the button navigates to the checkout page.

8. Persistence (Required)

- Basket contents must persist across page reloads using localStorage.
- When the app loads, the basket state is initialized from localStorage if available.
- Any changes to the basket are immediately reflected in localStorage.

9. Error Handling

- The UI never crashes if basket operations fail; fallback UI or error messages are shown.

10. Testability

- All basket operations (add, remove, adjust quantity) can be tested via UI interactions.
- The basket state can be inspected and verified at any point in the user flow.

TESTING
PLAN FOR SIMPLE, PRAGMATIC JEST TESTS FOR BASKET EXPERIENCE
Global State Management
Test that the basket state is accessible from multiple components/pages.
Test that adding/removing items in one component reflects in another.
Adding Items
Test that adding a product to the basket increases the basket item count.
Test that adding the same product again increases its quantity, not the number of unique items.
Removing Items
Test that removing a product deletes it from the basket.
Test that reducing a product’s quantity to zero removes it from the basket.
Adjusting Quantity
Test that increasing a product’s quantity updates the basket state.
Test that decreasing a product’s quantity does not go below one.
Basket Display
Test that the basket page displays all items in the basket with correct details.
Test that subtotal, shipping, and total are calculated and displayed correctly.
Test that an empty basket shows the empty state message and call-to-action.
BasketButton
Test that the BasketButton displays the correct total item count.
Test that the item count updates in real time as items are added or removed.
Checkout Integration
Test that the “Proceed to Checkout” button is enabled only when the basket has items.
Test that clicking the button navigates to the checkout page.
Persistence (Required)
Test that basket contents persist after a page reload (simulate reload by re-mounting the store/component).
Test that changes to the basket are saved to localStorage.
Error Handling
Test that the UI does not crash if basket operations fail (simulate errors).
Test that fallback UI or error messages are shown on failure.
Testability
Ensure all basket operations (add, remove, adjust quantity) can be triggered and verified via UI or store interactions.
Test that the basket state can be inspected and matches expected values after each operation.
