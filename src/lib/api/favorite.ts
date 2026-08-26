import type { Product } from "@/types/dtos";
import { apiRequest } from "./client";

export function getFavoriteIds() {
	return apiRequest<(number | string)[]>("/api/favorites/ids", { auth: true });
}

export function getFavorites() {
	return apiRequest<Product[]>("/api/favorites", { auth: true });
}

export function addFavorite(productId: number | string) {
	return apiRequest<void>(`/api/favorites/${productId}`, {
		method: "POST",
		auth: true,
	});
}

export function removeFavorite(productId: number | string) {
	return apiRequest<void>(`/api/favorites/${productId}`, {
		method: "DELETE",
		auth: true,
	});
}
