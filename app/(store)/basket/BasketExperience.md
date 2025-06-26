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

Specification: Basket Experience for “Add to Cart” Button on Individual Product Page
When the user first visits the individual product page, the “Add to Cart” (basket) button is visible if the product is not already in the basket.
When the user clicks the “Add to Cart” button:
The product is added to the basket with quantity 1.
The “Add to Cart” button is immediately replaced by quantity controls:
A minus (–) button to decrease quantity.
A plus (+) button to increase quantity.
A display of the current quantity.
An “X” (remove) button to remove the product from the basket entirely.
The quantity controls remain visible as long as the product is in the basket.
If the user increases the quantity, the displayed quantity updates accordingly.
If the user decreases the quantity:
If quantity is greater than 1, it decreases by 1.
If quantity would go below 1, the product is removed from the basket and the controls revert to the “Add to Cart” button.
If the user clicks the “X” button, the product is removed from the basket and the controls revert to the “Add to Cart” button.
The experience and controls should match the behavior and appearance of the product listing page’s product thumbnail after adding to basket, ensuring consistency across the app.
All changes to the basket state are reflected in real time in the UI and in the global basket state.
