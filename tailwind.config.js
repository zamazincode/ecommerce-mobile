/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				dr: {
					red: {
						DEFAULT: "#E30613",
						light: "#FF3B47",
						dark: "#B8000A",
					},
					navy: {
						DEFAULT: "#002B49",
						light: "#0A436D",
						dark: "#001A2C",
					},
					blue: "#0066B3",
					yellow: "#FDB913",
					green: "#27AE60",
					orange: "#F37021",
				},
			},
		},
	},
	plugins: [],
};
