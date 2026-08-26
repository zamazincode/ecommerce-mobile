import type { SearchResult, Suggestion } from "@/types/dtos";
import { apiRequest } from "./client";

export function getSuggestions(term: string) {
	// DİKKAT: bu endpoint küçük "q" istiyor
	return apiRequest<Suggestion[]>(
		`/api/search/suggest?q=${encodeURIComponent(term)}`,
	);
}

export type SearchParams = {
	q: string;
	page?: number;
	pageSize?: number;
	categoryId?: number;
	minPrice?: number;
	maxPrice?: number;
	inStock?: boolean;
};

export function searchProducts(params: SearchParams) {
	const qs = new URLSearchParams();
	qs.set("Q", params.q); // DİKKAT: burada büyük "Q"
	if (params.page) qs.set("Page", String(params.page));
	if (params.pageSize) qs.set("PageSize", String(params.pageSize));
	if (params.categoryId) qs.set("CategoryId", String(params.categoryId));
	if (params.minPrice !== undefined)
		qs.set("MinPrice", String(params.minPrice));
	if (params.maxPrice !== undefined)
		qs.set("MaxPrice", String(params.maxPrice));
	if (params.inStock !== undefined)
		qs.set("InStock", String(params.inStock));
	return apiRequest<SearchResult>(`/api/search?${qs.toString()}`);
}
