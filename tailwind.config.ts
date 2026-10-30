import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--base) / <alpha-value>)",
        raise: "rgb(var(--raise) / <alpha-value>)",
        lift: "rgb(var(--lift) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        // Color is reserved for the three dimensions
        mint: "#0E8A6A", // inside Haiti
        sun: "#C2650A", // Haitians abroad
        peri: "#4655D6", // the world acting on Haiti
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        serif: ["Inter", "system-ui", "sans-serif"],
        heading: ['"Bowlby One"', "sans-serif"],
      },
      fontSize: {
        // Modular scale (≈1.333)
        "d-0": ["clamp(5rem, 22vw, 13rem)", { lineHeight: "0.95", letterSpacing: "0" }],
        "d-1": ["clamp(3.25rem, 16vw, 10rem)", { lineHeight: "1", letterSpacing: "0" }],
        "d-2": ["clamp(2.25rem, 7vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "0" }],
        "d-3": ["clamp(1.6rem, 3.6vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "0" }],
        "d-4": ["1.4rem", { lineHeight: "1.2", letterSpacing: "0" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
