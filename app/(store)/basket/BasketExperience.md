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

Specification: Basket Experience for “Add to Cart” Button and Controls on Products Listing Page
Initial State
Each product card or thumbnail on the products listing page displays an “Add to Cart” button if the product is not currently in the basket.
Adding to Basket
When the user clicks the “Add to Cart” button on a product card:
The product is added to the basket with quantity 1.
The “Add to Cart” button is immediately replaced by quantity controls for that product.
Quantity Controls
The quantity controls consist of:
A minus (–) button to decrease quantity.
A plus (+) button to increase quantity.
A display of the current quantity.
An “X” (remove) button to remove the product from the basket entirely.
These controls are visible as long as the product is in the basket.
Increasing Quantity
Clicking the plus (+) button increases the product’s quantity in the basket by 1.
The displayed quantity updates in real time.
Decreasing Quantity
Clicking the minus (–) button decreases the product’s quantity by 1, but not below 1.
If the quantity would go below 1, the product is removed from the basket and the controls revert to the “Add to Cart” button.
Removing from Basket
Clicking the “X” button removes the product from the basket.
The controls revert to the “Add to Cart” button.
UI Consistency
The appearance and behavior of the quantity controls on the product card must match those on the individual product page.
All controls must be accessible (proper roles and labels) and provide immediate feedback.
State Synchronization
All changes to the basket state from the listing page are reflected in real time in the global basket state.
The basket state is consistent across the listing page, individual product page, basket page, and header BasketButton.
Persistence
Basket state changes from the listing page persist across page reloads (via localStorage).
Error Handling
The UI never crashes if basket operations fail; fallback UI or error messages are shown.
Testability
All basket operations (add, remove, adjust quantity) can be tested via UI interactions on the product card.
The basket state can be inspected and verified at any point in the user flow.
Summary:
The products listing page must provide a seamless, real-time, and consistent basket experience for each product card, matching the individual product page and ensuring all state changes are global, persistent, and testable.

BASKET PAGE SPECIFICATIONS

# Basket Page Experience Specifications

## 1. Page Load & Initial State

### 1.1 Empty Basket State

**Test: "Empty basket displays browse products message"**

- **GIVEN:** User navigates to /basket with empty basket
- **WHEN:** Page loads
- **THEN:** Shows empty state with shopping cart icon, "Your basket is empty" message, and "Browse Products" button
- **AND:** No order summary is displayed
- **AND:** Header basket count shows 0

### 1.2 Populated Basket State

**Test: "Basket displays all items with correct information"**

- **GIVEN:** Basket contains 2+ different products
- **WHEN:** User navigates to /basket
- **THEN:** All items are displayed with product name, brand, price, image, and quantity
- **AND:** Order summary shows correct subtotal, shipping, and total
- **AND:** "Proceed to Checkout" button is enabled

## 2. Item Display & Information

### 2.1 Product Information Display

**Test: "Each basket item shows complete product details"**

- **GIVEN:** Product in basket
- **WHEN:** Viewing basket page
- **THEN:** Item displays product name (linked to product page), brand, individual price, quantity, and product image
- **AND:** Product name links to individual product page
- **AND:** Price shows currency formatting (e.g., $249.99)

### 2.2 Responsive Item Layout

**Test: "Item layout adapts correctly on mobile and desktop"**

- **GIVEN:** Basket with items on different screen sizes
- **WHEN:** Viewing on mobile (< 1024px)
- **THEN:** Items stack vertically with price and quantity inline
- **AND:** Remove button appears next to quantity controls
- **WHEN:** Viewing on desktop (≥ 1024px)
- **THEN:** Items display in grid layout with separate columns for price, quantity, and remove

## 3. Quantity Modification

### 3.1 Increase Quantity

**Test: "Increasing quantity updates item and totals"**

- **GIVEN:** Product A in basket with quantity 1
- **WHEN:** User clicks + button on Product A
- **THEN:** Product A quantity increases to 2
- **AND:** Line total updates (price × new quantity)
- **AND:** Order subtotal and total update immediately
- **AND:** Header basket count increases

### 3.2 Decrease Quantity

**Test: "Decreasing quantity updates item and totals"**

- **GIVEN:** Product A in basket with quantity 3
- **WHEN:** User clicks - button on Product A
- **THEN:** Product A quantity decreases to 2
- **AND:** Line total updates accordingly
- **AND:** Order subtotal and total update immediately
- **AND:** Header basket count decreases

### 3.3 Minimum Quantity Enforcement

**Test: "Quantity cannot decrease below 1"**

- **GIVEN:** Product A in basket with quantity 1
- **WHEN:** User clicks - button on Product A
- **THEN:** Quantity remains at 1
- **AND:** No error message is shown
- **AND:** Totals remain unchanged

## 4. Item Removal

### 4.1 Remove Single Item

**Test: "Removing item updates basket and totals"**

- **GIVEN:** Basket with Product A (qty 2) and Product B (qty 1)
- **WHEN:** User clicks X button on Product A
- **THEN:** Product A is completely removed from basket
- **AND:** Only Product B remains
- **AND:** Order totals recalculate excluding Product A
- **AND:** Header basket count updates

### 4.2 Remove Last Item

**Test: "Removing last item shows empty basket state"**

- **GIVEN:** Basket with only Product A
- **WHEN:** User removes Product A
- **THEN:** Empty basket state is displayed
- **AND:** Order summary disappears
- **AND:** Header basket count shows 0

## 5. Order Summary Calculations

### 5.1 Subtotal Calculation

**Test: "Subtotal calculates correctly for multiple items"**

- **GIVEN:** Product A ($100 × 2) and Product B ($50 × 1) in basket
- **WHEN:** Viewing order summary
- **THEN:** Subtotal shows $250.00
- **AND:** Item count shows "3 items"

### 5.2 Shipping Calculation

**Test: "Shipping fee applies correctly"**

- **GIVEN:** Any items in basket
- **WHEN:** Viewing order summary
- **THEN:** Shipping shows fixed fee (e.g., $15.99)
- **AND:** Total includes shipping in calculation

### 5.3 Total Calculation

**Test: "Total combines subtotal and shipping"**

- **GIVEN:** Subtotal of $250.00 and shipping of $15.99
- **WHEN:** Viewing order summary
- **THEN:** Total shows $265.99
- **AND:** VAT inclusion note is displayed

## 6. Navigation & Actions

### 6.1 Checkout Navigation

**Test: "Checkout button navigates to checkout page"**

- **GIVEN:** Basket with items
- **WHEN:** User clicks "Proceed to Checkout"
- **THEN:** User navigates to /checkout
- **AND:** Basket state is preserved

### 6.2 Continue Shopping

**Test: "Continue shopping returns to products page"**

- **GIVEN:** User on basket page
- **WHEN:** User clicks "Continue Shopping" or "Browse Products"
- **THEN:** User navigates to /products
- **AND:** Basket state is preserved

### 6.3 Product Page Navigation

**Test: "Product name links to individual product page"**

- **GIVEN:** Product A in basket
- **WHEN:** User clicks on Product A name
- **THEN:** User navigates to Product A's individual page
- **AND:** Basket state is preserved

## 7. State Persistence & Synchronization

### 7.1 Page Reload Persistence

**Test: "Basket contents persist after page reload"**

- **GIVEN:** Basket with specific items and quantities
- **WHEN:** User reloads page (F5 or browser refresh)
- **THEN:** All items and quantities are preserved
- **AND:** Order totals remain correct

### 7.2 Cross-Page Synchronization

**Test: "Basket changes reflect across all pages"**

- **GIVEN:** Product A in basket viewed on basket page
- **WHEN:** Quantity is changed on product listing page
- **THEN:** Basket page automatically reflects the change
- **AND:** Order totals update accordingly

## 8. Error Handling & Edge Cases

### 8.1 Invalid Product Data

**Test: "Page handles corrupted basket data gracefully"**

- **GIVEN:** Basket contains item with missing price or name
- **WHEN:** Loading basket page
- **THEN:** Page loads without crashing
- **AND:** Invalid items are either fixed with defaults or removed
- **AND:** User sees appropriate message if items were removed

### 8.2 Network Errors

**Test: "Page functions during temporary network issues"**

- **GIVEN:** User modifying basket during network interruption
- **WHEN:** Quantity changes or item removal attempted
- **THEN:** Changes are queued and applied when connection resumes
- **OR:** User sees appropriate error message with retry option

## 9. Accessibility & Usability

### 9.1 Keyboard Navigation

**Test: "All interactive elements are keyboard accessible"**

- **GIVEN:** User navigating with keyboard only
- **WHEN:** Tabbing through basket page
- **THEN:** All buttons (quantity controls, remove, checkout) are focusable
- **AND:** Focus indicators are clearly visible
- **AND:** Actions can be triggered with Enter/Space

### 9.2 Screen Reader Support

**Test: "Screen readers announce basket changes"**

- **GIVEN:** User with screen reader
- **WHEN:** Quantity is changed or item removed
- **THEN:** Screen reader announces the change
- **AND:** Current totals are announced
- **AND:** All buttons have descriptive aria-labels

### 9.3 Loading States

**Test: "Loading states provide clear user feedback"**

- **GIVEN:** User performing action that requires server communication
- **WHEN:** Action is processing
- **THEN:** Loading indicator is shown
- **AND:** Interactive elements are disabled during processing
- **AND:** User cannot trigger duplicate actions

## 10. Performance Requirements

### 10.1 Page Load Performance

**Test: "Basket page loads quickly with many items"**

- **GIVEN:** Basket with 20+ items
- **WHEN:** Navigating to basket page
- **THEN:** Page loads within 2 seconds
- **AND:** All images lazy-load appropriately

### 10.2 Real-time Updates

**Test: "Quantity changes update immediately"**

- **GIVEN:** User clicking quantity controls rapidly
- **WHEN:** Making multiple quick changes
- **THEN:** UI updates are debounced appropriately
- **AND:** Final state is accurate
- **AND:** No duplicate API calls are made
