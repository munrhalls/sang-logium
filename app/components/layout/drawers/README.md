# 🗄️ URL-Driven Drawer System

## 1. Problem

Managing global UI state (like Modals, Drawers, and Panels) often leads to:

- **Lag/Bad user experience:** Next's native parallel routes + route interception LAGS. On lower device settings and connections, user might wait 0.5-1 SECOND until _just the url changes_!
- **Prop Drilling:** Passing `isOpen` through multiple layers.
- **Sync Issues:** The URL doesn't reflect the UI, breaking the "Back" button.
- **Layout Shift:** Rendering heavy drawer content inside the main tree causes re-renders.

## 2. Solution: Shallow Routing

I use `nuqs` library to sync the drawer state directly to the URL search parameters. The `DrawersManager` acts as a single "Shell" that subscribes to the `?drawer=` parameter, dynamically rendering the correct feature component.

## 3. Architecture

The DrawersManager acts as a global "host" component that listens to the ?d URL parameter to dynamically render the correct feature (Cart, Menu, Account) inside a shared UI shell.

Critically, opening a drawer creates a new browser history entry (PUSH) so the hardware "Back" button closes it, while internal navigation (like switching Account tabs) updates the current entry (REPLACE) to prevent trapping the user in a history loop.

```mermaid
graph TD
    %% Styling
    classDef userAction fill:#f59e0b,stroke:#b45309,color:#fff,rx:5,ry:5;
    classDef urlState fill:#0f172a,stroke:#3b82f6,color:#fff,stroke-dasharray: 5 5;
    classDef component fill:#1e293b,stroke:#94a3b8,color:#fff;
    classDef logic fill:#10b981,stroke:#047857,color:#fff;

    %% Nodes
    User([User Clicks 'Cart' Button]):::userAction
    UrlCart[URL: /store?drawer=cart]:::urlState

    subgraph Client_Boundary [Client Side]
        Nuqs(nuqs hook detects change):::logic
        Shell[DrawersManager Shell \n 'isOpen' becomes true]:::component

        subgraph Rendered_Content [Dynamic Content]
            Cart[< BasketSidebar />]:::component
            Menu[< MobileMenu />]:::component
        end
    end

    %% Flows
    User -->|history.push| UrlCart
    UrlCart -->|Auto-sync| Nuqs
    Nuqs -->|Passes State| Shell

    Shell -->|drawer === 'cart'| Cart
    Shell -.->|drawer === 'menu'| Menu

    %% Closing Logic
    Back([User Clicks Back Button]):::userAction
    UrlClean[URL: /store]:::urlState

    Back -->|history.pop| UrlClean
    UrlClean --> Nuqs
    Nuqs -.->|null| Shell
    Shell -.->|Closes| Rendered_Content
```
