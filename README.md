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

- Integrates Google Address Validation API to validate address before fetching real-time rates via shipping provider APIs.
- Ensures every label generated maps to a real, deliverable physical location.

### ORDERS MANAGEMENT SYSTEM

- Centralized dashboard for tracking fulfillment stages, allowing manual status overrides when real-world logistics require it.
- Order Lifecycle tracked and managed with meticulously cautious, thorough steps using what's called Granular Finite State Machine
- Views are split for "OWNER", "MANAGER", "PACKER" - each containing User Experience maximally simplified and tailored for the role.
- For example - "PACKER" sees only and only UI elements relevant to their exact physical job parts of packing: "TO_PACK", "PACKING_LOCKED", "FLAG ISSUE", "PENDING_PRINT_LABEL", "SHIPPED"

### WAREHOUSE PACKING SYSTEM

- Order lifecycle - managed by ENUMERABLE - goes through packing stages

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

- Mobile drawers system using NUQS, seamlessly integrated with the web URL address, ensuring lightning fast navigation that retains back/forward navigation.

---

## TECH STACK

- **Framework:** Next.js 15+ (App Router)
- **Library:** React (19+)
- **Language:** TypeScript (Strict typing for both App and Sanity Content Lake)
- **CMS:** Sanity (Backend) + GROQ (Query Language)
- **Styling:** Tailwind CSS
- **Auth:** Clerk.dev
- **Services:** Google Address Validation API (Address Validation), Stripe (Payments), Inngest (Event orchestration/Idempotency)

---

## ARCHITECTURE & PATTERNS

### Server-First Routing

Primary pages are Server Components (no "use client" directive). Data fetching is parallelized on the server to reduce waterfall requests.

### Performance

Images - one of the single biggest influencing factors for the whole project's performance - are handled purely by Sanity, which is a design choice. It ensures CDN-based, edge-utilizing delivery. Mistakes of mixing up Next.js optimizations with Sanity CMS optimizations are thoroughly avoided.

Code-splitting and everything about render trees is organized for the real end-user's experience first, and google performance metrics second.

### Compatibility

Cross-browser and cross-OS compatible. Tested via playwright, and admittedly minimally but still - on iphones and android phones.

### Testing

Testing approach is very strategic - as few as possible, as impactful as possible. It still involves /unit, /integration, /e2e tests but they are always for a concrete, end-purpose. It follows, to some degree, Kent C. Dodds diamond shape, where most tests are /integration and /e2e.

Example - google validation address API handler route required ensemble team of various different types of tests to ensure the confusing, multi-layered response object is handled in a way that contains all the possibilities and maps them onto proper result response for the consumer - the storefront's address collection form. Unit tests made sure the handler its parses the complex reponse with no fails. Integration tests ensured the state transitions operate as expected. E2E test ensures it all meshes smoothly with no errors.

### Type Safety Pattern

Using Sanity Typegen to auto-generate types for schemas and GROQ queries. Frontend components utilize these generated types for strict checks against the CMS data structure.

### Development Pattern

- **Fetch Strategy:** Sanity Schema -> Localhost Studio -> GROQ Library -> React Server Component -> Prebuilt Props -> Client Components.
- **Design:** Assets designed in Figma, calibrated, and built directly into code in layers (Structure -> Mock Content -> Real Data Integration).

### Web development strategy

- Everything underwent utterly extensive, hundreds upon hundreds of hours, processes of systems-thinking and organizational engineering. That is to say - organizing everything as simply as possible first, paper sketches, diagrams, documentation second, and code - third.
