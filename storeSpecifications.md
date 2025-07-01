Zustand Store Hydration Pattern
Test: "Store provides hydration status"

GIVEN: Fresh store instance
WHEN: Store is created
THEN: \_hasHydrated should be false

Test: "Store signals when rehydration completes"

GIVEN: Store with localStorage data
WHEN: Persist middleware rehydrates
THEN: \_hasHydrated should be true

Test: "Store maintains data integrity during hydration"

GIVEN: Basket data in localStorage
WHEN: Store rehydrates
THEN: Basket data should match localStorage exactly AND \_hasHydrated should be true

Test: "Store operations work regardless of hydration status"

GIVEN: Store with \_hasHydrated: false
WHEN: Any basket operation is performed
THEN: Operation should succeed and persist correctly
