import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        raise: "#F5F5F4",
        lift: "#EBEBEA",
        rule: "#E4E4E2",
        fg: "#0A0A0A",
        dim: "#6E6E6B",
        // Color is reserved for the three dimensions
        mint: "#0E8A6A", // inside Haiti
        sun: "#C2650A", // Haitians abroad
        peri: "#4655D6", // the world acting on Haiti
      },
      fontFamily: {
        display: ["'Bricolage Grotesque Variable'", "system-ui", "sans-serif"],
        serif: ["'Newsreader Variable'", "Georgia", "serif"],
      },
      fontSize: {
        // Modular scale (≈1.333)
        "d-0": ["clamp(9rem, 40vw, 19rem)", { lineHeight: "0.8", letterSpacing: "-0.03em" }],
        "d-1": ["clamp(5.5rem, 27vw, 17rem)", { lineHeight: "0.82", letterSpacing: "-0.03em" }],
        "d-2": ["clamp(3rem, 9vw, 6.5rem)", { lineHeight: "0.9", letterSpacing: "-0.025em" }],
        "d-3": ["clamp(2rem, 4.6vw, 3.25rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "d-4": ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
