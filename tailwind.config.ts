import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B2321", // deep mountain-sea green
        raise: "#11302D",
        lift: "#173B37",
        rule: "#1F4541",
        fg: "#E7EFEA",
        dim: "#8DA79F",
        mint: "#7FE0C2", // inside Haiti
        sun: "#F4C76A", // Haitians abroad
        peri: "#A9B5FF", // the world acting on Haiti
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
