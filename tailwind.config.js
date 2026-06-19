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
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(30, 41, 59, 0.65)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        bg: {
          light: '#F5F7FA',
          dark: '#0F172A',
        },
        accent: {
          light: '#3B82F6',
          dark: '#60A5FA',
          neon: '#00D1FF',
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
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 209, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'inner-glass': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'workspace': "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }
    },
  },
  plugins: [],
}
