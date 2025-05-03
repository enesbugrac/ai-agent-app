import type { Config } from "tailwindcss";

const colors = {
  primary: {
    DEFAULT: "#FFDB48",
    light: "#F3BA2F",
    dark: "#D4A120",

    neonGreen: "#00FF88",
    cyan: "#00D4FF",
    neonCyan: "#00FFFF",
    yellow: "#FFDB48",

  },
  background: {
    DEFAULT: "#13151A",
    secondary: "#1A1D23",
    card: "rgba(19, 21, 26, 0.95)",
    overlay: "rgba(19, 21, 26, 0.5)",
    highlight: "rgba(255, 219, 72, 0.05)",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#888888",
    tertiary: "#FFDB48",
    muted: "#666666",
    black: "#13151A",
    neonGreen: "#00FF88",
    neonCyan: "#00FFFF",
    hover: "#00FF88",
  },
  border: {
    DEFAULT: "rgba(136, 136, 136, 0.2)",
    light: "rgba(243, 186, 47, 0.05)", 
    dark: "rgba(243, 186, 47, 0.2)",
    neonGreen: "#00FF88",
    neonCyan: "#00FFFF",
    secondary: "#888888",
    tertiary: "#FFDB48",

  },
  status: {
    success: {
      DEFAULT: "#00FF88",
      background: "#103020",
      shadow: "rgba(34, 197, 94, 0.35)",
    },
    error: {
      DEFAULT: "#FF3131",
      background: "#401010",
      shadow: "rgba(239, 68, 68, 0.35)",
    },
  },
};

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      backgroundColor: {
        ...colors.background,
        primary: colors.primary.DEFAULT,
      },
      textColor: {
        ...colors.text,
        primary: colors.text.primary,
      },
      borderColor: {
        ...colors.border,
        primary: colors.primary.DEFAULT,
      },
      boxShadow: {
        'success-glow': '0 0 10px var(--success-shadow)',
        'error-glow': '0 0 10px var(--error-shadow)',
      },
      fontFamily: {
        "markpro": ['MarkPro', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
