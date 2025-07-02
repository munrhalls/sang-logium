# Basket Components

This directory contains isolated UI components for a basket system in the e-commerce application. These components are designed to be completely separated from business logic and state management.

## Available Components

### BasketButton

A navigation button that shows the current item count in the basket, designed for the header.

```tsx
import BasketButton from "@/app/components/basket/BasketButton";

// Usage in header
<BasketButton itemCount={3} />;
```

### Basket Controls

Add/subtract buttons for adjusting product quantity on product listings and individual product pages.

### Basket Page

A complete basket page UI located at `/app/basket/page.tsx` that displays basket items and checkout options.

## Integration Notes

These components are designed to be UI-only and do not contain any actual business logic. When integrating with the full application:

1. Connect the components to your state management solution (e.g., Zustand, which is installed in this project)
2. Implement the actual handlers for the placeholder functions
3. Replace the sample data with real data from your API or state store

For example, to integrate BasketButton with Zustand:

```tsx
// In a real component using Zustand
import useBasketStore from "@/store/basketStore";
import BasketButton from "@/app/components/basket/BasketButton";

function Header() {
  const itemCount = useBasketStore((state) => state.items.length);

  return (
    <header>
      {/* Other header content */}
      <BasketButton itemCount={itemCount} />
    </header>
  );
}
```
