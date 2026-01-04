%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#3b82f6', 'edgeLabelBackground':'#1e293b', 'tertiaryColor': '#fff'}}}%%
graph TD
classDef default fill:#1e293b,stroke:#94a3b8,stroke-width:1px,color:#fff;
classDef urlState fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#60a5fa,stroke-dasharray: 5 5;
classDef userAction fill:#f59e0b,stroke:#b45309,stroke-width:1px,color:#fff,rx:5,ry:5;
classDef systemLogic fill:#10b981,stroke:#047857,stroke-width:1px,color:#fff;

    subgraph Browser_Window [Browser Window / Main Layout]
        direction TB
        Start(User on Page):::default
        URL_Idle[URL: /store]:::urlState
        Start --- URL_Idle

        ClickBtn([User Clicks 'Account' Button]):::userAction
        BackBtn([User Clicks 'Browser Back']):::userAction
    end

    subgraph Drawer_Overlay [Drawer Manager Overlay]
        direction TB
        DrawerOpen{Drawer Shell Opens}:::systemLogic

        subgraph Internal_State [Internal Feature State]
            ViewMenu[View: Menu]:::default
            ViewOrders[View: Orders]:::default
            ClickTab([User Clicks 'Orders']):::userAction
        end

        URL_Active[URL: /store?d=account]:::urlState
        URL_Deep[URL: /store?d=account&view=orders]:::urlState
    end

    %% Flows
    URL_Idle --> ClickBtn
    ClickBtn -->|1. History PUSH| URL_Active
    URL_Active -.-> DrawerOpen

    DrawerOpen --> ViewMenu
    ViewMenu --> ClickTab

    ClickTab -->|2. History REPLACE| URL_Deep
    URL_Deep -.-> ViewOrders

    %% Back Button Logic
    ViewOrders -.-> BackBtn
    ViewMenu -.-> BackBtn
    BackBtn -->|3. Pops History Stack| URL_Idle

    %% Closing Logic
    URL_Idle -.->|Drawer Unmounts| Start
