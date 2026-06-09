import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "var(--navy)",
        "navy-lt": "var(--navy-lt)",
        blue: "var(--blue)",
        "blue-dk": "var(--blue-dk)",
        "blue-50": "var(--blue-50)",
        "green-400": "var(--green-400)",
        green: "var(--green)",
        "green-50": "var(--green-50)",
        amber: "var(--amber)",
        "amber-50": "var(--amber-50)",
        "amber-200": "var(--amber-200)",
        red: "var(--red)",
        "red-50": "var(--red-50)",
        purple: "var(--purple)",
        "purple-50": "var(--purple-50)",
        "gray-900": "var(--gray-900)",
        "gray-700": "var(--gray-700)",
        "gray-500": "var(--gray-500)",
        "gray-200": "var(--gray-200)",
        "gray-100": "var(--gray-100)",
        "gray-50": "var(--gray-50)",
        white: "var(--white)",
        "human-story": "var(--human-story)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        full: "var(--r-full)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(32, 33, 36, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
