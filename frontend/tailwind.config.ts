import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F172A", // Slate 900
          accent: "#2563EB",  // Royal Blue 600
          secondary: "#38BDF8", // Sky Blue 400
          surface: "#F8FAFC",
          border: "#E2E8F0",
          muted: "#64748B",
        },
        audit: {
          error: "#EF4444",
          warning: "#F59E0B",
          advisory: "#3B82F6",
          success: "#10B981",
        },
      },
    },
  },
  plugins: [],
};

export default config;

