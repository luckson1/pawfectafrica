import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
 
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#46518C",
         " primary-content": "#FFFFFF",
          secondary: "#D9A648",
          accent: "#F2D49B",
          neutral: "#3d4451",
          "base-100": "#fff",
        },
      },
      "dark",
   
    ],
  },
} satisfies Config;
