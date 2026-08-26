import type { ProductFilters } from "@/types";
import type { CategoryTree, PagedProducts } from "@/types/dtos";
import { toQueryString } from "../utils";
import { apiRequest } from "./client";

export function getCategoryTree() {
	return apiRequest<CategoryTree[]>("/api/categories/tree");
}

export function getCategoryProducts(slug: string, filters: ProductFilters) {
	return apiRequest<PagedProducts>(
		`/api/categories/${slug}/products?${toQueryString(filters)}`,
	);
}
