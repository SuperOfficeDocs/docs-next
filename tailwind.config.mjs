/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        lightTealGray: '#e6eeee',
        superOfficeGreen: '#0c5d58',
        seaFoamGreen: '#31b494',
        deepTeal: '#0a5e58',
        mistBlue: '#a7d4de',
        transparentTeal: '#0a5e581a',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
};
