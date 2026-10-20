/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#F7F7F2',
          surface: '#FFFFFF',
        },
        ink: {
          primary: '#202820',
          secondary: '#70786F',
        },
        brand: {
          DEFAULT: '#245C45',
          hover: '#1B4735',
          sage: '#DDE9DD',
          mint: '#EAF3EA',
        },
        line: {
          DEFAULT: '#E1E5DD',
          subtle: '#EAEFE7',
        },
        semantic: {
          success: '#28764B',
          warning: '#A66B19',
          error: '#B54742',
          chartSecondary: '#738BA0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      }
    },
  },
  plugins: [],
}
