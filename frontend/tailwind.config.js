const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Custom colors from HTML - Updated to Blue/White theme
          login: "#0EA5E9", // Sky 500 (Was Indigo 600)
          dashboard: {
            light: '#E0F2FE', // Sky 100
            DEFAULT: '#0EA5E9', // Sky 500
            dark: '#0369A1', // Sky 700
          },
          chat: "#3B82F6" // Blue 500
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        // Custom UI colors - Updated to match Blue/White theme
        "light-blue": "#E0F2FE", // Sky 100
        "background-light": "#F8FAFC", // Slate 50
        "text-main": "#0F172A", // Slate 900
        "text-secondary": "#64748B", // Slate 500
        "status-red": "#EF4444",
        "status-yellow": "#FBBF24",
        "status-green": "#10B981",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "2rem", // Chat UI
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'subtle': '0 4px 15px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(173, 216, 230, 0.2), 0 4px 6px -2px rgba(173, 216, 230, 0.1)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
