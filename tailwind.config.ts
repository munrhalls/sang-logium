import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import typographyPlugin from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // gruppo: ["Gruppo", "sans-serif"],
        iceland: ["Iceland", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        sans: ["var(--font-iceland)"],
        // montserrat: ["Montserrat", "sans-serif"],
        // playfair: ["Playfair Display", "serif"],
        // raleway: ["Raleway", "sans-serif"],
        // lora: ["Lora", "serif"],
        // poppins: ["Poppins", "sans-serif"],
        // roboto: ["Roboto", "sans-serif"],
        // merriweather: ["Merriweather", "serif"],
        // bebas: ["Bebas Neue", "sans-serif"],
        // lobster: ["Lobster", "cursive"],
      },
      screens: {
        "2xs": "450px",
        "2xl": "1600px",
        "3xl": "1920px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        promotion: {
          DEFAULT: "#CF8226",
          foreground: "#CF8226",
        },
        lightpromotion: {
          DEFAULT: "rgb(255 158 43)",
          foreground: "rgb(255 158 43)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin],
} satisfies Config;
