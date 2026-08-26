export type ProductFilters = {
	page?: number;
	pageSize?: number;
	categoryId?: number;
	authorId?: number;
	publisherId?: number;
	minPrice?: number;
	maxPrice?: number;
	inStock?: boolean;
	sortBy?: string;
	sortDir?: "asc" | "desc";
};
