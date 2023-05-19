/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
          "primary-focus": '#333f7a',
         " primary-content": "#FFFFFF",
         "secondary-focus": '#a37115',
          secondary: "#D9A648",
          accent: "#F2D49B",
          neutral: "#3d4451",
          "base-100": "#fff",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#46518C",
          "primary-focus": '#333f7a',
          secondary: "#D9A648",
          "secondary-focus": '#a37115',
          accent: "#F2D49B",
        }
      },
    
   
    ],
  },
} satisfies Config;
