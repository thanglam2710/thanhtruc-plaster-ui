import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Thêm màu từ mẫu thiết kế
        brand: {
          primary: '#6a4b3b',    // Nâu đậm
          secondary: '#ebc9a2',  // Vàng cát/Be
        },
        bg: {
          main: '#FAF8F5',       // Trắng ngà
        },
        text: {
          body: '#6a4b3b',
          muted: '#8D7B70',
        }
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-be-vietnam)', 'sans-serif'],
      },
      borderRadius: {
        'section': '24px',
        'card': '16px',
        'btn': '4px'
      }
    },
  },
  plugins: [],
} satisfies Config;