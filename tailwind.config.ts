import type { Config } from "tailwindcss";
import 'flowbite';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1d1d1d",
        "primary-1": "#7878ec",
        "primary-2": "#9a59f5",
        "primary-3": "#d064d4",
        "primary-4": "#e9bded",
        "primary-orange-1": "#ef753a",
        "primary-orange-2": "#fd8516",
        "primary-green-1": "#34d594",
      },
    },
  },
  plugins: [],
};
export default config;
