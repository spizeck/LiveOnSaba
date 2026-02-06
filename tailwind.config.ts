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
        primary: "#2D5A3D",
        "primary-dark": "#6BBF7A",
        secondary: "#8B7355",
        "secondary-dark": "#C4A77D",
        accent: "#4A7C59",
        "accent-dark": "#7FB88B",
        "background-light": "#F5F3F0",
        "background-dark": "#1A1F1C",
        "surface-light": "#FFFFFF",
        "surface-dark": "#252B27",
        "text-primary-light": "#1A1A1A",
        "text-primary-dark": "#F0F0F0",
        "text-secondary-light": "#5A5A5A",
        "text-secondary-dark": "#A0A0A0",
      },
    },
  },
  plugins: [],
};

export default config;
