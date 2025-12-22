# Application Product Design, Architecture, Backend & Frontend Development

**By:** Munrhalls
**Project Status:** Final Construction Phase (Shipping in 1-2 weeks)
**Project Type:** Solo Development (12+ months)

[**LIVE STOREFRONT**](https://sang-logium.com) | [**LIVE MANAGEMENT PANEL**](https://sang-logium.com/studio)

Professional, large-scale e-commerce application featuring 500+ products and two key components seamlessly integrated:

- **Storefront App:** Optimized for customer engagement and speed.
- **Management App:** Comprehensive control for the owner.

The architecture is robust, secure, and fault-tolerant, designed to prioritize an error-free, lightning-fast, and intuitive user experience.

---

## KEY FEATURES

### PAYMENTS

- Secure utilization of embedded Stripe checkout sessions, hiding sensitive data from the client.
- Idempotency ensured via Inngest—the app automatically retries connections to guarantee transaction finality.

### CHECKOUT

- Multi-step wizard supporting guest and user modes with seamless transitions and saved-address autofill.
- Uses an "authorize-first" server-side pattern to lock inventory before capturing funds, preventing race conditions and overselling.
- Fully idempotent architecture ensures transactions resolve correctly even if connectivity drops mid-process.

### ADDRESS VALIDATION AND SHIPPING

- Integrates Google Maps Platform to sanitize inputs before fetching real-time rates via shipping provider APIs.
- Ensures every label generated maps to a real, deliverable physical location.

### ORDERS MANAGEMENT SYSTEM

- Centralized dashboard for tracking fulfillment stages, allowing manual status overrides when real-world logistics require it.

### RETURNS AND REFUNDS SYSTEM

- Architected via a finite state machine to strictly map physical order states to digital statuses.
- Uses idempotent background queues (Inngest) to guarantee Stripe refunds and inventory re-stocking happen exactly once, without fail.

### PRODUCT DISCOVERY EXPERIENCE

- Organized with extreme care to ensure performance and reliability while browsing 500+ products.
- Search, pagination, filtering, and sorting work seamlessly synchronized with the URL on any device, without lag.

### BASKET (CART) EXPERIENCE

- Intuitive and simple, allowing frictionless transition to checkout.
- Built on a solid architecture that ensures security and a lag-free experience.

### LANDING PAGE EXPERIENCE

- Hero carousel and immersive design elements immediately draw the user into the brand's unique mood.

### MOBILE EXPERIENCE

- Mobile drawers system seamlessly integrated with the web URL address, ensuring navigation without delays.

---

## TECH STACK

- **Framework:** Next.js 15+ (App Router)
- **Library:** React (19+)
- **Language:** TypeScript (Strict typing for both App and Sanity Content Lake)
- **CMS:** Sanity (Backend) + GROQ (Query Language)
- **Styling:** Tailwind CSS
- **Auth:** Clerk.dev
- **Services:** Google Maps Platform (Address Validation), Stripe (Payments), Inngest (Event orchestration/Idempotency)

---

## ARCHITECTURE & PATTERNS

### Server-First Routing

Primary pages are Server Components (no "use client" directive). Data fetching is parallelized on the server to reduce waterfall requests.

### Type Safety Pattern

Using Sanity Typegen to auto-generate types for schemas and GROQ queries. Frontend components utilize these generated types for strict checks against the CMS data structure.

### Development Pattern

- **Fetch Strategy:** Sanity Schema -> Localhost Studio -> GROQ Library -> React Server Component -> Prebuilt Props -> Client Components.
- **Design:** Assets designed in Figma, calibrated, and built directly into code in layers (Structure -> Mock Content -> Real Data Integration).
