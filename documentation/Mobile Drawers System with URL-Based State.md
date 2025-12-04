# Mobile Drawer System with URL-Based State Management

# Architecture Overview

The codebase implements a mobile drawer system using the Interleaving Pattern where Server Components handle data fetching and Client Components manage UI state through URL query parameters.

# Component Hierarchy

MobileCategoriesDrawerWrapper (Server Component)

Marked as async - responsible for server-side data fetching
Fetches categories using getAllCategories()
Sorts and validates data before passing to client
Returns JSX containing the Client Component
MobileCategoriesDrawer (Client Component)

Contains "use client" directive
Receives pre-fetched categories as props from server component
Uses useSearchParams() to read URL state: ?menu=true
Renders drawer with CSS transform based on URL state
Close functionality via Link to current pathname (removes query params)
MobileSearchDrawer (Client Component)

Similar pattern: reads ?search=true from URL
Simpler implementation with search form
DrawerToggleLink (Client Component)

Toggles drawer state by updating URL
Uses Next.js <Link> component to navigate to ?menu=true or ?search=true
Closing drawer: navigates back to current pathname without query params
State Management Pattern
URL as Single Source of Truth:

Drawer visibility controlled by query parameters: ?menu=true or ?search=true
useSearchParams() reads current URL state within Client Components
Mutual exclusion logic: only one drawer can be open at a time
State transitions use Next.js navigation (<Link> component)

URL as Single Source of Truth:

Drawer visibility controlled by query parameters: ?menu=true or ?search=true
useSearchParams() reads current URL state within Client Components
Mutual exclusion logic: only one drawer can be open at a time
State transitions use Next.js navigation (<Link> component)

DATA FLOW:
Server: getAllCategories() → MobileCategoriesDrawerWrapper
↓ (props)
Client: MobileCategoriesDrawer reads URL via useSearchParams()
↓
Drawer renders with transform: translate-x-0 or -translate-x-full
