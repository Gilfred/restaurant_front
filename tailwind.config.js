/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F5F7FA',
          dark: '#0F172A',
        },
        card: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 41, 59, 0.65)',
        },
        accent: {
          light: '#3B82F6',
          dark: '#60A5FA',
        },
        success: {
          light: '#10B981',
          dark: '#34D399',
        },
        warning: {
          light: '#F59E0B',
          dark: '#FBBF24',
        },
        danger: {
          light: '#EF4444',
          dark: '#F87171',
        },
        text: {
          primary: {
            light: '#1E293B',
            dark: '#F8FAFC',
          },
          secondary: {
            light: '#64748B',
            dark: '#94A3B8',
          },
        }
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
