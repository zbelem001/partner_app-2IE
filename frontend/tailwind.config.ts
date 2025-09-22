import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#023047',
          medium: '#0f4c5c',
          light: '#e8f1f5',
        },
        neutral: {
          light: '#e5e5e5',
        },
        accent: {
          orange: '#e36414',
          'orange-light': '#fef3e7',
        },
        stats: {
          'blue-bg': '#f0f8ff',
          'green-bg': '#f0fdf4',
          'orange-bg': '#fff7ed',
          'red-bg': '#fef2f2',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;