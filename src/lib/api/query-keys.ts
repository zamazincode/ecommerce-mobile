export const queryKeys = {
	home: ["home"] as const,
	products: (params: unknown) => ["products", params] as const,
	product: (slug: string) => ["product", slug] as const,
	relatedProducts: (id: number | string) => ["product", id, "related"] as const,
	categories: ["categories"] as const,
	category: (slug: string, params: unknown) =>
		["category", slug, params] as const,
	search: (params: unknown) => ["search", params] as const,
	cart: ["cart"] as const,
	orders: (params: unknown) => ["orders", params] as const,
	order: (orderNumber: string) => ["order", orderNumber] as const,
	addresses: ["addresses"] as const,
	favorites: ["favorites"] as const,
	favoriteIds: ["favorite-ids"] as const,
};
