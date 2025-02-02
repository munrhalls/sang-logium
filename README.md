LIVE: https://sang-logium.com

E-commerce retail store selling audio gear. Fictional (albeit with full functionality, including payments) project intended for my web development portfolio, for the purpose of showcasing my skills.

Tech stack:

- next.js 15+ (App router)
- react (19+)
- typescript (both for sanity, using typegen and frontend app)
- sanity CMS for backend
- GROQ for communication CMS-FRONTEND
- tailwind

Project structure:

- pages constructed from /features and /layout
  -- /features constructed from /components
  --- components constructed from individual re-usable entities such as carousel, product card, text or product commercial etc.

Fetch pattern:

- sanity schema -> sanity documents via localhost /studio -> sanity library of groq queries -> frontend react server component using a groq query from sanity library -> prebuilding everything that can be prebuilt -> feeding prebuilt components to client components as props (where it makes sense)

Type safety pattern:

- I'm using typegen from sanity -> all types are auto-generated for schemas AND for groq queries -> I use groq queries on frontend for type checks

  This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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
