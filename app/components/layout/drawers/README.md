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

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#3b82f6', 'edgeLabelBackground':'#1e293b', 'tertiaryColor': '#fff'}}}%%
graph TD
    classDef default fill:#1e293b,stroke:#94a3b8,stroke-width:1px,color:#fff;
    classDef urlState fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#60a5fa,stroke-dasharray: 5 5;
    classDef userAction fill:#f59e0b,stroke:#b45309,stroke-width:1px,color:#fff,rx:5,ry:5;
    classDef systemLogic fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff;

    subgraph Browser_Window [Browser Window]
        direction TB
        Start(User on Page):::default
        URL_Idle[URL: /store]:::urlState
        ClickBtn([User Clicks 'Account']):::userAction
        BackBtn([User Clicks 'Back']):::userAction
    end

    subgraph Drawer_Overlay [Drawer Manager]
        direction TB
        DrawerOpen{Drawer Opens}:::systemLogic
        URL_Active[URL: /store?d=account]:::urlState

        subgraph Internal_State [Feature State]
            ViewMenu[View: Menu]:::default
            ClickTab([Select 'Orders']):::userAction
            ViewOrders[View: Orders]:::default
        end
    end

    Start --- URL_Idle
    URL_Idle --> ClickBtn
    ClickBtn -->|Push History| URL_Active
    URL_Active -.-> DrawerOpen
    DrawerOpen --> ViewMenu

    ViewMenu --> ClickTab
    ClickTab -->|Replace History| ViewOrders

    ViewOrders -.-> BackBtn
    BackBtn -->|Pop History| URL_Idle
```
