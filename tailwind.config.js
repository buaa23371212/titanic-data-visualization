/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 泰坦尼克号主题色
        titanic: {
          primary: '#1e3a8a',     // 深蓝色 - 海洋主题
          secondary: '#dc2626',   // 红色 - 警示/生存主题
          accent: '#059669',      // 绿色 - 生存/安全
          neutral: '#6b7280',     // 中性灰色
          background: '#f8fafc',  // 浅背景色
          card: '#ffffff',        // 卡片背景
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class', // 支持暗色模式
}