import type { ProductFilters } from "@/types";
import type { PagedProducts, Product, ProductDetail } from "@/types/dtos";
import { toQueryString } from "../utils";
import { apiRequest } from "./client";

export type { ProductFilters };

export function getProducts(filters: ProductFilters) {
	return apiRequest<PagedProducts>(`/api/products?${toQueryString(filters)}`);
}

export function getProductBySlug(slug: string) {
	return apiRequest<ProductDetail>(`/api/products/${slug}`);
}

export function getProductsBySlug(slug: string) {
	return getProductBySlug(slug);
}

export function getRelatedProducts(id: number | string) {
	return apiRequest<Product[]>(`/api/products/${id}/related`);
}
