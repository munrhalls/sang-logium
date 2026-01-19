# Home Page Data Orchestrator

## 1. The Problem
* **Pain Point:** Fragmented, asynchronous fetching across multiple page segments creates network waterfalls, high developer cognitive load when tracking data flow, and unpredictable LCP (Largest Contentful Paint) performance.
* **Impact:** Increased Sanity API costs due to redundant requests, layout shift (CLS) during component hydration, and slower build times for static generation.

## 2. The Solution
* **Strategy:** Colocated Parallel Data Fetching with React Server Components.
* **Mechanism:**
    * **Parallel Independent Queries:** Each page segment (Hero, Main, Bottom) is an async server component that fetches only its required data via a focused GROQ query. Next.js executes these fetches concurrently during server rendering—no waterfalls.
    * **Zero Prop-Drilling:** Data stays local to the component that needs it, eliminating complex slicing, interfaces, or orchestration logic.
    * **Native LCP Optimization:** Use Next.js `<Image priority={true}>` in the Hero component for automatic resource hints and preloading—no manual HTML shell intervention needed.
    * **Automatic Deduplication & Caching:** React's built-in cache dedupes identical queries within a request; Sanity client caching handles repeats across requests.
* **Tech Stack:** Next.js 15 (App Router), React 18 (RSC), Sanity 3 (GROQ).

## 3. Architecture

How does the Data Orchestrator work?

1. The Core Mechanism:

```mermaid
graph TD
    Page[Next.js Home Page<br/>app/page.tsx] --> Hero[HeroSegment<br/>async Server Component]
    Page --> Main[MainSegment<br/>async Server Component]
    Page --> Bottom[BottomSegment<br/>async Server Component]

    Hero -->|Focused GROQ Query| Sanity(Sanity Content Lake)
    Main -->|Focused GROQ Query| Sanity
    Bottom -->|Focused GROQ Query| Sanity

    Sanity -.->|Hero Data| Hero
    Sanity -.->|Main Data| Main
    Sanity -.->|Bottom Data| Bottom

    Hero -->|Next.js Image<br/>priority=true| LCP[LCP Optimized]

    subgraph ParallelExecution [Parallel Fetching & Rendering]
        direction TB
        Hero
        Main
        Bottom
    end

    style ParallelExecution fill:#f0f8ff,stroke:#333,stroke-dasharray: 5 5
    style Hero fill:#e6f3ff,stroke:#0366d6
    style Main fill:#e6f3ff,stroke:#0366d6
    style Bottom fill:#e6f3ff,stroke:#0366d6