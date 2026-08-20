import type { components } from "@/types/api";
import { apiRequest } from "./client";

type ProductListDto = components["schemas"]["ProductListDto"];

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

function toQueryString(filters: ProductFilters) {
	const params = new URLSearchParams();
	if (filters.page) params.set("Page", String(filters.page));
	if (filters.pageSize) params.set("PageSize", String(filters.pageSize));
	if (filters.categoryId)
		params.set("CategoryId", String(filters.categoryId));
	if (filters.authorId) params.set("AuthorId", String(filters.authorId));
	if (filters.publisherId)
		params.set("PublisherId", String(filters.publisherId));
	if (filters.minPrice) params.set("MinPrice", String(filters.minPrice));
	if (filters.maxPrice) params.set("MaxPrice", String(filters.maxPrice));
	if (filters.inStock !== undefined)
		params.set("InStock", String(filters.inStock));
	if (filters.sortBy) params.set("SortBy", filters.sortBy);
	if (filters.sortDir) params.set("SortDir", filters.sortDir);
	return params.toString();
}

export function getProducts(filters: ProductFilters) {
	return apiRequest<{ items: ProductListDto[]; totalCount: number }>(
		`/api/products?${toQueryString(filters)}`,
	);
}
