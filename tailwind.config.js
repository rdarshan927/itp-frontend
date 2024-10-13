/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'mdmm': '840px',
        'mm': '947px',
        'lg': '1024px',
        'xlg': '1200px'
      },
      colors: {
        lightP: "#F5DAD2",
        lightY: "#FCFFE0",
        lightG: "#BACD92",
        darkG: "#75A47F",
        adminLightGreen: "#C2D39B",
        adminBlack1: "#000000",
        adminBlack2: "#414141",
        adminWhite: "#FFFFFF",
        clientWhite: "#FFFFFF",

        // darkmode
        cOne: "#121212",
        cTwo: "#1F1F1F",
        bOne: "#757575",
        bTwo: "#1DB954"
        

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },

      fontSize: {
        '2xl': '1.5rem',   
        '3xl': '2rem',     
        '4xl': '2.5rem',   
        '5xl': '3rem',     
        '6xl': '4rem',     
       
      }
    },
  },
  plugins: [],
};
