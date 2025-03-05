import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      typography: () => ({
        pink: {
          css: {
            "--tw-prose-body": "var(--color-pink-800)",
            "--tw-prose-headings": "var(--color-pink-900)",
            "--tw-prose-lead": "var(--color-pink-700)",
            "--tw-prose-links": "var(--color-pink-900)",
            "--tw-prose-bold": "var(--color-pink-900)",
            "--tw-prose-counters": "var(--color-pink-600)",
            "--tw-prose-bullets": "var(--color-pink-400)",
            "--tw-prose-hr": "var(--color-pink-300)",
            "--tw-prose-quotes": "var(--color-pink-900)",
            "--tw-prose-quote-borders": "var(--color-pink-300)",
            "--tw-prose-captions": "var(--color-pink-700)",
            "--tw-prose-code": "var(--color-pink-900)",
            "--tw-prose-pre-code": "var(--color-pink-100)",
            "--tw-prose-pre-bg": "var(--color-pink-900)",
            "--tw-prose-th-borders": "var(--color-pink-300)",
            "--tw-prose-td-borders": "var(--color-pink-200)",
            "--tw-prose-invert-body": "var(--color-pink-200)",
            "--tw-prose-invert-headings": "var(--color-white)",
            "--tw-prose-invert-lead": "var(--color-pink-300)",
            "--tw-prose-invert-links": "var(--color-white)",
            "--tw-prose-invert-bold": "var(--color-white)",
            "--tw-prose-invert-counters": "var(--color-pink-400)",
            "--tw-prose-invert-bullets": "var(--color-pink-600)",
            "--tw-prose-invert-hr": "var(--color-pink-700)",
            "--tw-prose-invert-quotes": "var(--color-pink-100)",
            "--tw-prose-invert-quote-borders": "var(--color-pink-700)",
            "--tw-prose-invert-captions": "var(--color-pink-400)",
            "--tw-prose-invert-code": "var(--color-white)",
            "--tw-prose-invert-pre-code": "var(--color-pink-300)",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": "var(--color-pink-600)",
            "--tw-prose-invert-td-borders": "var(--color-pink-700)",
          },
        },
      }),
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
