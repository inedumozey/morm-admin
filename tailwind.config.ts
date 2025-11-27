import { frame } from "framer-motion";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        frame: "var(--frame)",
        bg: "var(--bg)",
        card: "var(--card)",
        border: "var(--border)",
        text: "var(--text)",
        text2: "var(--text2)",
        sec: "var(--sec)",
        "sec-faded": "var(--sec-faded)",
        pri: "var(--pri)",
        "pri-faded": "var(--pri-faded)",
        red: "var(--red)",
        "red-faded": "var(--red-faded)",
        green: "var(--green)",
        "green-faded": "var(--green-faded)",
        yellow: "var(--yellow)",
        "yellow-faded": "var(--yellow-faded)",
        from: "var(--from)",
        to: "var(--to)",
      },
      opacity: {
        fade: ".7",
        fade2: ".9",
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { background: "hsl(200,20%,60%)" },
          "50%": { background: "hsl(200,20%,85%)" },
        },
        "skeleton-colored": {
          "0%": { background: "#FFB23C", color: "#2860BF" },
          "100%": { background: "#2860BF", color: "#FFB23C" },
        },
        "spinner-card": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-acw": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "spin-cw": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        skeleton: "skeleton 1.5s linear infinite alternate",
        "skeleton-colored": "skeleton-colored 2s linear infinite alternate",
        "spinner-card": "spinner-card 15s linear infinite",
        "spin-cw": "spin-cw 1s linear infinite",
        "spin-acw": "spin-acw 1s linear infinite reverse",
      },
    },
  },
  plugins: [],
};
