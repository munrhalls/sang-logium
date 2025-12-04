LIVE: https://sang-logium.com

E-commerce retail store selling audio gear. It's fully real professional e-commerce web application, complete with checkout and payments. It's not a real shop, though. This is project for portfolio, to demonstrate skill of building largest scale, real-world project.

Tech stack:

- next.js 15+ (App router)
- react (19+)
- typescript (both for sanity, using typegen and frontend app)
- sanity CMS for backend
- GROQ for communication CMS<->FRONTEND
- tailwind
- clerk.dev for authentication and user management
- Google Maps Platform's Address Validation API for address verification

Project structure:

1. Server-First Routing Architecture
Primary pages are Server Components (no "use client" directive)
Homepage (page.tsx) - async server component
Product listing (page.tsx) - async with parallel data fetching
Individual product (page.tsx) - async server component
All product pages use server-side data fetching
Example (Homepage):
export const revalidate = 5400;
export const dynamic = "force-static";
export default async function Page() {
// Server component with async data fetching
return (
   <main>
   <Suspense fallback={<Skeleton />}>
   <ServerComponent />
   </Suspense>
   </main>
   );
   }
export default async function ProductsPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [productsResult, filterOptions, sortOptions] = await Promise.all([
    getSelectedProducts(...),
    getFiltersForCategoryPathAction(...),
    getSortablesForCategoryPathAction(...)
  ]);
  // Server-side parallel data fetching ✅
}

- pages constructed from /features and /layout
  -- /features constructed from /components
  --- components constructed from individual re-usable entities such as carousel, product card, text or product commercial etc.

Strategic Client Component Usage
"use client" Distribution

Pages with "use client": 5 out of 24 total pages (21%)
page.tsx ✅
page.tsx ✅ (form interactions)
page.tsx ✅ (payment processing)
page.tsx ✅ (modal)
page.tsx ✅ (modal)
Client components are strategically limited to:

Interactive UI elements (carousels, modals, drawers)
Form controls (filters, sort, pagination)
State management wrappers (basket, checkout)
User interaction handlers

Modern Data Fetching Patterns
Server-Side Data Fetching:
// Bestsellers.tsx - Server Component
export default async function Bestsellers() {
const [commercial] = await getCommercialsByFeature("bestsellers");
// Direct async/await in server component ✅
}

// CategoriesWrapper.tsx - Server Component
export default async function CategoriesWrapper() {
const categories = await getAllCategories();
return <CategoriesNav categories={categories} />;
}

4. Suspense Boundaries & Streaming
   <Suspense fallback={<HeroCommercialsSkeleton />}>
   <HeroCommercials />
   </Suspense>
   <Suspense fallback={<BestsellersSkeleton />}>
   <Bestsellers />
   </Suspense>
   Granular suspense boundaries for independent data sources
   Custom skeleton components for each section
   Streaming-ready architecture

5. Advanced App Router Features
   app/(store)/
   @drawer/
   page.tsx
   (.)tracking/page.tsx
   (.)account/page.tsx
   Intercepting routes for modals ((.)tracking)
   Parallel slot implementation (@drawer)

Dynamic Routes:

products/[...category] - catch-all segments
product/[id] - dynamic parameters

Performance Implications
✅ Minimal JavaScript sent to client (server components dominant)
✅ Parallel data fetching reduces waterfall requests
✅ Streaming with Suspense boundaries
✅ Static generation where appropriate
✅ No client-side data fetching overhead

Alignment with Next.js 15+ Requirements
Requirement Status Evidence
Server Components by Default ✅ Pass 19/24 pages are server components
Async Server Components ✅ Pass All data fetching uses async/await
Suspense Streaming ✅ Pass Comprehensive Suspense boundaries
Parallel Routes ✅ Pass @drawer slot implemented
Route Handlers ✅ Pass /api routes present
Server Actions ⚠️ Partial Uses separate action files, not inline
Metadata API ✅ Pass export const metadata used
No Legacy Fetch ✅ Pass No useEffect fetch patterns

Modern Next.js 15 architecture with server-first rendering
Appropriate separation of server and client components
Advanced App Router features (parallel routes, intercepting routes)
Performance-conscious patterns (streaming, suspense, static generation)

/////////////////////////////////////////////////////
+++
Fetch pattern:

- sanity schema -> sanity documents via localhost /studio -> sanity library of groq queries -> frontend react server component using a groq query from sanity library -> prebuilding everything that can be prebuilt -> feeding prebuilt components to client components as props (where it makes sense)

Type safety pattern:

- I'm using typegen from sanity -> all types are auto-generated for schemas AND for groq queries -> I use groq queries on frontend for type checks

Development experience pattern:

- I'm deploying to production very frequently, often many times per day, which realizes fast iteration cycles and fast feedback
- All the assets, logo, imagery etc. were designed by me and calibrated on figma - however, I don't develop a full-fledged design for the web app, instead, I develop enough of a design to gain full clarity on what should fit how into the whole - then I build it straight into the app
- I am experimental but I try to build things in layers: e.g., first build the ideas and eliminate risks of doomed endeavors, then scaffold the frontend layout with empty contents, then fill it with mock contents, then actually develop backend schema types, type relationships, fetch pattern integrations and then populate backend with real data

- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### API Keys Setup

This project uses external APIs that require keys for full functionality:

1. **Clerk Authentication**: Set up your Clerk.dev account and get API keys
2. **Google Maps Platform**: Set up Address Validation API for address verification
   - See [SETUP_API_KEYS.md](/SETUP_API_KEYS.md) for detailed instructions
3. **Sanity CMS**: Create a Sanity.io project and configure tokens

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

// const categories = [
// {
// name: "Headphones",
// icon: <FaHeadphones />,
// subcategories: [
// "Over-Ear",
// "In-Ear",
// "On-Ear",
// "Wireless",
// "Noise-Cancelling",
// ],
// },
// {
// name: "Studio Equipment",
// icon: <FaMicrophone />,
// subcategories: [
// "Microphones",
// "Audio Interfaces",
// "Studio Monitors",
// "Recording Bundles",
// ],
// },
// {
// name: "Accessories",
// icon: <FaToolbox />,
// subcategories: [
// "Cables",
// "Cases",
// "Stands",
// "Adapters",
// "Replacement Parts",
// ],
// },
// {
// name: "Hi-Fi Audio",
// icon: <FaMusic />,
// subcategories: ["Amplifiers", "DACs", "Speakers", "Turntables"],
// },
// ];

// TODO README, fill in later:
// - document my professional use of AI-assisted workflow by a mature and responsible web developer
// -- document what I DON'T DO: "tenant" workflow / lack of ownership / offloading cognition to agent

- identify next task
- paste task data and ask github copilot to research it in codebase
- read it (albeit its sometimes skimming...sensing no need to get into the weeds)
- ask github copilot to formulate plan
- read it (albeit its sometimes skimming...sensing no need to get into the weeds)
- ask github copilot to implement plan
- read it (albeit its sometimes skimming...sensing no need to get into the weeds)

  // -- document what I ACTUALLY DO, HYBDRID INTELLIGENCE LOOP
  - paste task data and ask github copilot to research it in codebase
  - read it deeply, top-down as measured by network-understanding
  - hunt down the first point that might be wrong and go deep on it
  - form GRINDE of organizing info about problem (Justin Sung reference) understanding -> minimally represent on paper
  - organize simplest plan
    -- then ask ai to come up with its own plan
    -- compare the two plans with the awareness built from my own cognitive work
    -- organize simplest plan from the two
    -- set up safe git commit, easy rollback point
    -- whatever I can implement easily by hand, implement by hand
    -- delegate rest to AI
    -- read every single piece of code change and hunt for first suspicious sign of anything that's potentially concerning
    -- confirm or go deep on disprepancy area and fix it
    -- repeat until complete or rollback and start over
