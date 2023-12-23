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
          "0%": { opacity: "15%", transform: "scaleX(102%)" },
          "50%": { opacity: "100%", transform: "scaleX(100%)" },
          "65%": { opacity: "50%", transform: "scaleX(100%)" },
          "100%": { opacity: "15%", transform: "scaleX(102%)" }
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
  plugins: [require("@codaworks/react-glow/tailwind")]
};
export default config;
