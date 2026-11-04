/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16121A',
        paper: '#FAF6FF',
        coral: {
          DEFAULT: '#FF4D6D',
          light: '#FF8FA3',
          dark: '#D42C50'
        },
        violet: {
          DEFAULT: '#7B2FF7',
          light: '#A66BFF',
          dark: '#5A1FC2'
        },
        sun: '#FFC94D'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #FF4D6D 0%, #7B2FF7 100%)',
        'brand-gradient-soft': 'linear-gradient(120deg, rgba(255,77,109,0.12) 0%, rgba(123,47,247,0.12) 100%)'
      }
    }
  },
  plugins: []
}
