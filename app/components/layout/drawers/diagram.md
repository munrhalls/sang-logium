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