export const colors = {
	// Brand Colors
	primary: {
		DEFAULT: "#E30613",
		light: "#FF3B47",
		dark: "#B8000A",
		hover: "#C70510",
	},
	secondary: {
		DEFAULT: "#002B49",
		light: "#0A436D",
		dark: "#001A2C",
	},
	accent: {
		blue: "#0066B3",
		yellow: "#FDB913",
		green: "#27AE60",
		orange: "#F37021",
	},

	badge: {
		discount: "#E30613",
		bestseller: "#F37021",
		editorPick: "#8E44AD",
		freeCargo: "#27AE60",
	},

	// Neutral / Greyscale
	neutral: {
		50: "#F9FAFB", // Arka plan (soft)
		100: "#F3F4F6", // Kart arka planları / border soft
		200: "#E5E7EB", // Çizgiler, divider
		300: "#D1D5DB", // Pasif icon/border
		400: "#9CA3AF", // Placeholder metinler
		500: "#6B7280", // İkincil açıklamalar / alt metin
		600: "#4B5563", // Yazar / Yayınevi isimleri
		700: "#374151", // Koyu metin
		800: "#1F2937", // Başlıklar
		900: "#111827", // Ana gövde metni
	},

	// Light / Dark Base
	light: {
		background: "#FFFFFF",
		surface: "#F8F9FA",
		card: "#FFFFFF",
		text: "#111827",
		subtext: "#6B7280",
		border: "#E5E7EB",
	},
	dark: {
		background: "#0F172A",
		surface: "#1E293B",
		card: "#1E293B",
		text: "#F8FAFC",
		subtext: "#94A3B8",
		border: "#334155",
	},
} as const;

export type AppColors = typeof colors;
