"use client";

import { useEffect } from 'react';

// Used to track if we need to fetch user data or if it's already cached
let isUserDataCached = false;

/**
 * Pre-fetches Clerk resources to speed up subsequent loads
 * Call this in the _app or root layout component
 */
export function usePrefetchClerkResources() {
  useEffect(() => {
    // Only run this once per session
    if (!isUserDataCached) {
      const prefetchResources = async () => {
        try {
          // Prefetch Clerk JS bundle - use standard CDN URL instead of custom domain
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
          link.as = 'script';
          document.head.appendChild(link);

          // Mark as cached
          isUserDataCached = true;
        } catch {
          // Silently fail - no need to capture the error
        }
      };

      // Use requestIdleCallback for non-blocking prefetch
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(prefetchResources, { timeout: 5000 });
      } else {
        setTimeout(prefetchResources, 500);
      }
    }
  }, []);
}

/**
 * Authentication hook that uses sessionStorage caching
 * to avoid waterfall requests and blocking page loads
 */
export function useAuthSessionCache() {
  return {
    clearSessionCache: () => {
      try {
        sessionStorage.removeItem('user_display_info');
      } catch {
        // Ignore errors - no need to capture the error
      }
    }
  };
}

/**
 * Initialize Clerk with optimized settings
 * Call this function in your ClerkProvider component
 */
export const getOptimizedClerkOptions = () => {
  return {
    // Reduce network requests with longer cache
    appearance: {
      // Use shimmer effect during loading for better UX
      layout: {
        shimmer: true,
        logoPlacement: 'none', // Don't show Clerk's logo to reduce load time
      },
      variables: {
        // Use smaller colorPrimary to reduce paint time
        colorPrimary: 'rgb(0, 0, 0)',
      },
      elements: {
        // Optimize modal to prevent layout shifts
        card: 'rounded shadow-none',
        formButtonPrimary: 'bg-black',
        footerActionLink: 'text-black',
        // Ensure sufficient contrast
        formFieldInput: 'border-2 border-gray-300 focus:border-black',
      },
    },
    
    // Speed up page navigation with more agreesive loading
    navigate: (to) => {
      window.location.href = to;
    },
    
    // Use loading fallbacks to avoid blocking UI
    loadingFallback: () => null,
    
    // Use persistent sessions
    tokenCache: 'session-storage',
  };
};