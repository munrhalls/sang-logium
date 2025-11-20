BasketControls Hydration-Aware Rendering
Test: "Component shows loading state when store not hydrated"

GIVEN: Store with \_hasHydrated: false
WHEN: BasketControls renders with any product
THEN: Component should render skeleton with animate-pulse classes

Test: "Component shows correct state when store hydrated and item not in basket"

GIVEN: Store with \_hasHydrated: true and empty basket
WHEN: BasketControls renders with product {\_id: "test1", name: "Test", price: 10, stock: 5}
THEN: Component should render "Add to cart" button

Test: "Component shows correct state when store hydrated and item in basket"

GIVEN: Store with \_hasHydrated: true and basket containing [{_id: "test1", name: "Test", price: 10, quantity: 2}]
WHEN: BasketControls renders with product {\_id: "test1", name: "Test", price: 10, stock: 5}
THEN: Component should render quantity controls showing quantity: 2

Test: "Component never shows Add to cart then switches to quantity controls"

GIVEN: Store that will rehydrate with existing basket item
WHEN: BasketControls renders during hydration process
THEN: Component should show skeleton until hydrated, then directly show quantity controls
