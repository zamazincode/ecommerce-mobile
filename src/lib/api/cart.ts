import type { Cart } from "@/types/dtos";
import { apiRequest } from "./client";

export function getCart() {
	return apiRequest<Cart>("/api/cart", { auth: true });
}

export function addCartItem(productId: number | string, quantity = 1) {
	return apiRequest<Cart>("/api/cart/items", {
		method: "POST",
		auth: true,
		body: { productId: Number(productId), quantity },
	});
}

export function updateCartItem(productId: number | string, quantity: number) {
	return apiRequest<Cart>(`/api/cart/items/${productId}`, {
		method: "PATCH",
		auth: true,
		body: { quantity },
	});
}

export function removeCartItem(productId: number | string) {
	return apiRequest<Cart>(`/api/cart/items/${productId}`, {
		method: "DELETE",
		auth: true,
	});
}

export function clearCart() {
	return apiRequest<void>("/api/cart", {
		method: "DELETE",
		auth: true,
	});
}

export function mergeGuestCart() {
	return apiRequest<Cart>("/api/cart/merge", {
		method: "POST",
		auth: true,
	});
}

export function applyCoupon(code: string) {
	return apiRequest<Cart>("/api/cart/coupon", {
		method: "POST",
		auth: true,
		body: { code },
	});
}

export function removeCoupon() {
	return apiRequest<Cart>("/api/cart/coupon", {
		method: "DELETE",
		auth: true,
	});
}
