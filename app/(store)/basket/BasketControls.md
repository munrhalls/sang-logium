**BasketControls: Add to Cart**
Test: "User adds a product to the basket from any context"

- GIVEN: Product with id="p1" is not in the basket, stock=5
- WHEN: User clicks the "Add to Cart" button
- THEN: Basket store contains {id: "p1", quantity: 1} and UI shows quantity controls for p1

**BasketControls: Increment Quantity (Stock-Limited)**
Test: "User increases quantity of a product in the basket up to available stock"

- GIVEN: Basket store contains {id: "p2", quantity: 2}, stock=3
- WHEN: User clicks the "+" button
- THEN: Basket store contains {id: "p2", quantity: 3} and UI displays quantity 3

Test: "User cannot increase quantity above available stock"

- GIVEN: Basket store contains {id: "p2", quantity: 3}, stock=3
- WHEN: User clicks the "+" button
- THEN: Basket store remains {id: "p2", quantity: 3}, "+" button is disabled, and UI displays quantity 3

**BasketControls: Decrement Quantity**
Test: "User decreases quantity of a product in the basket"

- GIVEN: Basket store contains {id: "p3", quantity: 3}, stock=10
- WHEN: User clicks the "-" button
- THEN: Basket store contains {id: "p3", quantity: 2} and UI displays quantity 2

Test: "User removes product by decrementing to zero"

- GIVEN: Basket store contains {id: "p3", quantity: 1}, stock=10
- WHEN: User clicks the "-" button
- THEN: Product with id="p3" is removed from basket and UI shows "Add to Cart" button

**BasketControls: Remove from Basket**
Test: "User removes product using remove (X) button"

- GIVEN: Basket store contains {id: "p4", quantity: 2}, stock=10
- WHEN: User clicks the "X" button
- THEN: Product with id="p4" is removed from basket and UI shows "Add to Cart" button

**BasketControls: Error Handling**
Test: "Error fallback is shown if store operation fails"

- GIVEN: Basket store throws error on any update for product id="err1", stock=10
- WHEN: User clicks any control (Add, +, -, X)
- THEN: UI displays error fallback and disables controls for product id="err1"

**BasketControls: UI Consistency**
Test: "Controls look and behave the same in all contexts"

- GIVEN: Product with id="p5" is in the basket, quantity=2, stock=10, on product page, listing, and basket page
- WHEN: User views the controls in any context
- THEN: UI shows identical controls (–, qty, +, X) and behavior is consistent everywhere

BasketControls: Product ID Normalization
Test: "Product with id is correctly added to the basket as id"
GIVEN: Product with id="mongo123", name="Sanity Product", stock=7, price=150, and the basket is empty
WHEN: User clicks the "Add to Cart" button
THEN: Basket store contains {id: "mongo123", quantity: 1, name: "Sanity Product", price: 150} and UI shows quantity controls for that product
