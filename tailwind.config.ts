import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F1',
        'brown-dark': '#2C1810',
        'brown-mid': '#6B5744',
        'brown-muted': '#A89882',
        'gold': '#D4A574',
        'border-light': '#E8DDD0',
        'border-mid': '#D7C9B8',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
