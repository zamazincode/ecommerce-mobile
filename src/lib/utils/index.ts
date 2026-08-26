import { ProductFilters } from "@/types";

export function toQueryString(filters: ProductFilters) {
	const params = new URLSearchParams();
	if (filters.page) params.set("Page", String(filters.page));
	if (filters.pageSize) params.set("PageSize", String(filters.pageSize));
	if (filters.categoryId)
		params.set("CategoryId", String(filters.categoryId));
	if (filters.authorId) params.set("AuthorId", String(filters.authorId));
	if (filters.publisherId)
		params.set("PublisherId", String(filters.publisherId));
	if (filters.minPrice !== undefined)
		params.set("MinPrice", String(filters.minPrice));
	if (filters.maxPrice !== undefined)
		params.set("MaxPrice", String(filters.maxPrice));
	if (filters.inStock !== undefined)
		params.set("InStock", String(filters.inStock));
	if (filters.sortBy) params.set("SortBy", filters.sortBy);
	if (filters.sortDir) params.set("SortDir", filters.sortDir);
	return params.toString();
}
