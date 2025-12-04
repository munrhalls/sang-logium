// TODO Testing Checklist
// Basic Functionality
//  Open mobile menu (tap hamburger icon or navigate to ?menu=true)
//  Drawer slides in from left with animation
//  Categories list displays with proper icons
//  "On Sale" category shows in orange color
//  Click "CLOSE" button - drawer slides out
// Navigation
//  Click top-level category link (e.g., "Headphones") - navigates correctly
//  Click subcategory link - navigates to correct URL
//  Click nested subcategory (3rd level) - navigates correctly
//  Links close drawer on navigation
// Error Handling
//  Categories load successfully (no connection errors)
//  If Sanity is down, error message displays instead of drawer
// Server/Client Boundary
//  No build errors (npm run build or verify in terminal)
//  No console errors in browser DevTools
//  No hydration mismatch warnings
//  Page loads without async component errors
// Visual/UX
//  Category tree structure renders properly (hierarchy visible)
//  Icons display next to category names
//  Hover states work on links
//  Scrolling works if category list is long
//  Drawer doesn't flash/flicker on mount
// Edge Cases
//  Works when switching between ?menu=true and ?search=true
//  Works when navigating between pages with drawer open
//  Drawer state resets properly on page navigation

// npm run build succeeds without async component errors
//  Navigate to /?menu=true - categories drawer opens
//  Navigate to /?search=true - search drawer opens
//  Navigate to / - both drawers closed
//  Click category links - navigation works
//  No console errors or hydration warnings
//  Server/Client boundaries respected
