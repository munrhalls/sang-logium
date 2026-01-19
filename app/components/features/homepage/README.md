# Home Page Data Orchestrator

## 1. The Problem
* **Pain Point:** Fragmented, asynchronous fetching across multiple page segments creates network waterfalls, high developer cognitive load when tracking data flow, and unpredictable LCP (Largest Contentful Paint) performance.
* **Impact:** Increased Sanity API costs due to redundant requests, layout shift (CLS) during component hydration, and slower build times for static generation.

## 2. The Solution
* **Strategy:** Single-Pass Mega-Query with Content Projection.
* **Mechanism:**
    * **GROQ Aggregation:** A single round-trip fetch builds the entire page tree at the entry point (Page Orchestrator).
    * **Semantic Slicing:** Prop-drilling resolved data "slices" to pure, functional UI segments (Hero, Main, Bottom).
    * **LCP Priority Hijacking:** Explicitly marking the Hero asset for browser preloading within the static HTML shell to ensure the fastest possible paint.
* **Tech Stack:** Next.js 15 (App Router), React 18 (RSC), Sanity 3 (GROQ).

## 3. Architecture

How does the Data Orchestrator work?

1. The Core Mechanism:

```mermaid
graph TD
    A[Next.js Page Orchestrator] -->|Single GROQ Query| B(Sanity Content Lake)
    B -->|Unified JSON Tree| A
    A -->|Hero Slice| C[HeroSegment]
    A -->|Main Slice| D[MainSegment]
    A -->|Bottom Slice| E[BottomSegment]
    C -->|Priority Image| F{LCP Optimized}