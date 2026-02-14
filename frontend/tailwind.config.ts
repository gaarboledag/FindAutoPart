import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#0F172A", // Azul Noche Profundo
                    light: "#F97316",   // Naranja Mecánico (accent/CTA)
                    dark: "#020617",
                    foreground: "#F8FAFC",
                },
                secondary: {
                    DEFAULT: "#F97316", // Naranja Mecánico / Torque
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#22C55E", // Success Green
                    foreground: "#FFFFFF",
                },
                surface: {
                    DEFAULT: "#1E293B", // Azul Pizarra
                    light: "#334155",
                    dark: "#0F172A",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                cta: {
                    DEFAULT: "#F97316",
                    hover: "#FB923C",
                    dark: "#EA580C",
                },
                steel: {
                    DEFAULT: "#94A3B8",
                    light: "#CBD5E1",
                    dark: "#64748B",
                },
            },
            borderRadius: {
                lg: "8px",
                md: "6px",
                sm: "4px",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-inter)", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "monospace"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 15px rgba(249,115,22,0.4)" },
                    "50%": { boxShadow: "0 0 25px rgba(249,115,22,0.6)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
