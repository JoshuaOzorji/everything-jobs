import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: {
				sm: "360px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
			},

			fontFamily: {
				markaziText: [
					"var(--font-markazi-text)",
					"sans-serif",
				],
				geistMono: [
					"var(--font-geist-mono)",
					"sans-serif",
				],
				geistSans: [
					"var(--font-geist-sans)",
					"sans-serif",
				],
				poppins: ["var(--font-poppins)", "sans-serif"],
			},

			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
