/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",

        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",

        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        secondary: "var(--secondary)",
        "secondary-container": "var(--secondary-container)",
        tertiary: "var(--tertiary)",
        "tertiary-container": "var(--tertiary-container)",

        background: "var(--background)",
        "surface-variant": "var(--surface-variant)",

        error: "var(--error)",

        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",

        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-primary": "var(--on-primary)",
        "on-secondary": "var(--on-secondary)",
        "on-tertiary": "var(--on-tertiary)",
      },

      fontFamily: {
        geist: ["Geist", "sans-serif"],
      },

      fontSize: {
        display: ["32px", { lineHeight: "1.2" }],
        "headline-lg": ["24px", { lineHeight: "1.3" }],
        "headline-md": ["20px", { lineHeight: "1.4" }],
        "body-lg": ["16px", { lineHeight: "1.6" }],
        "body-md": ["14px", { lineHeight: "1.5" }],
        "label-md": ["12px", { lineHeight: "1.2" }],
      },

      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },

      spacing: {
        base: "4px",
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        gutter: "24px",
        margin: "32px",
        sidebar: "240px",
      },

      boxShadow: {
        soft: "0px 4px 12px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
