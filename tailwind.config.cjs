/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "primary-content": "hsl(var(--primary-content))",
        "primary-dark": "hsl(var(--primary-dark))",
        "primary-light": "hsl(var(--primary-light))",

        secondary: "hsl(var(--secondary))",
        "secondary-content": "hsl(var(--secondary-content))",
        "secondary-dark": "hsl(var(--secondary-dark))",
        "secondary-light": "hsl(var(--secondary-light))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",

        copy: "hsl(var(--copy))",
        "copy-light": "hsl(var(--copy-light))",
        "copy-lighter": "hsl(var(--copy-lighter))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",

        "success-content": "hsl(var(--success-content))",
        "warning-content": "hsl(var(--warning-content))",
        "error-content": "hsl(var(--error-content))",
      },
    }
  },
  plugins: [],
}
