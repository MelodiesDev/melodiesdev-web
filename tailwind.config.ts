import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      keyframes: {
        breathing: {
          "0%": { opacity: "0%", transform: "scaleX(102%)" },
          "25%": { opacity: "30%", transform: "scaleX(100%)" },
          "50%": { opacity: "50%", transform: "scaleX(100%)" },
          "75%": { opacity: "30%", transform: "scaleX(100%)" },
          "100%": { opacity: "0%", transform: "scaleX(102%)" }
        },
        cloudmovement: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" }
        }
      },
      animation: {
        breathing: "breathing 8s linear infinite",
        cloudmovement: "cloudmovement 60s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
