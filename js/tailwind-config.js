import tailwind from "tailwindcss"

// Tailwind CSS Configuration

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6b8f71", // Sage green - softer and professional
          dark: "#5a7a60", // Darker sage for hover states
          light: "#8ba892", // Lighter sage for subtle accents
        },
        accent: {
          DEFAULT: "#d4a574", // Warm tan/beige accent
          dark: "#b8895f", // Darker warm tan
        },
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
    },
  },
}
