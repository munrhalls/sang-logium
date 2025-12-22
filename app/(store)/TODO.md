import MobileCategoriesDrawerShell from "@/app/components/layout/mobile/MobileCategoriesDrawerShell";
import MobileSearchDrawerShell from "@/app/components/layout/mobile/MobileSearchDrawerShell";

^rework coming

// Re-design of the whole solution concept (mostly adjustments but critical ones)
// TODO restructure route groups - ll actually be (shop) and (checkout)
// TODO refactor structure - all files around page.tsx go to /features/...
// TODO hero carouse - tbd but complete 100% refactor needed, wrote it a year ago
// TODO html @root layout shop - i need implement simpler/better solution than "scroll jail"
// TODO (shop) ll be home + prod grid indiv search + basket + brand pages, (checkout) ll be just checkout - also no menu @checkout, and + top nav @checkout
// TODO tests - this'll be a /unit /integration /e2e folders tree and only CUJ's ll be tested; for address validation - also unit test / tracer code
// TODO framer motion for animations
// TODO mobile drawers system - with NUQS and framer motion; and every drawer == inside mobile menu client comp, conditional render + fixed css

// TODO CRITICAL!!! ADD SPECULATION API FOR BLAZING FAST PREFETCH AND LOADS
// TODO CRITICAL!!! ADD SPECULATION API Speculation API Speculation API Speculation API
// TODO preloading where it fits
// TODO font to WOFF2, add font to public/fonts
// TODO In app/global.css, apply the font-sans and font-mono font families to different elements:
// TODO run @next/bundle-analyzer to see bundle size
// TODO make sure prefetching and code-splitting based on routes is fairly optimal
// TODO use template in the products grid for filter sorts (auto reset)

// TODO #1 !!! DOCS - You should not manually add <head> tags such as <title> and <meta> to root layouts. Instead, you should use the Metadata API which automatically handles advanced requirements such as streaming and de-duplicating <head> elements.

      {/* <head>
        <link
          rel="preload"
          href="/public/HeroMain.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="icon"
          href="public/logo-orbit.svg"
          type="image/svg+xml"
          fetchPriority="high"
          />
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="dns-prefetch" href="https://cdn.sanity.io" />
          </head> */}

{/_ TODO study understand interleaving pattern - make sure it is
implemented correctly _/}
{/_ TODO make drawer client side comp that accept props - renders conditionally based on url - has slide in animation - is instant - is mounted all the time, only changes css to show/hide - takes in server comp with categories - that comp fetches its data - uses streaming pattern - target: INSTANT FAST DRAWER SHOW/HIDE WITH URL AS ONLY SOURCE OF TRUTH_/}
{/_ <MobileCategoriesDrawerShell />
<MobileSearchDrawerShell /> _/}
{/_ TODO Scroll jail - need to somehow replace it with css sticky or just less 'hacky' solution _/}

{/_ TODO Drawers system -> Mobile menu - fastest ship === rework entirely, delete anything unnecessary, make it super simple - plan: - client comp, manages NUQS useQueryState, single state for all possible drawers - NUQS useQueryState state handles open/close based on url params, syncs to url - each drawer is inside this comp and uses framer motion for anims - each drawer mounts only if it's state is active
////// - the user account + orders will use the same drawers pattern - WHY: achieves INSTANT 0 lag drawers open/close AND url sync AND it's simple_/}
