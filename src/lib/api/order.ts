import type { components } from "@/types/api";
import type { OrderDetail } from "@/types/dtos";
import { apiRequest } from "./client";

let Crypto: typeof import("expo-crypto") | null = null;
try {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	Crypto = require("expo-crypto");
} catch {
	// Native modül yoksa fallback kullanılacak
}

export type CreateOrderRequest = {
	addressId: number | string;
	note?: string | null;
	expectedTotal?: number | null;
};

export type PagedOrders = components["schemas"]["PagedResultOfOrderListDto"];

export function createOrder(
	payload: CreateOrderRequest,
	idempotencyKey: string,
) {
	return apiRequest<OrderDetail>("/api/orders", {
		method: "POST",
		auth: true,
		body: {
			addressId: Number(payload.addressId),
			note: payload.note ?? null,
			expectedTotal: payload.expectedTotal ?? null,
		},
		headers: { "Idempotency-Key": idempotencyKey },
	});
}

export function newIdempotencyKey(): string {
	try {
		if (Crypto?.randomUUID) {
			return Crypto.randomUUID();
		}
	} catch {
		// Fallback
	}
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function getOrders(params: { page?: number; pageSize?: number } = {}) {
	const qs = new URLSearchParams();
	if (params.page) qs.set("Page", String(params.page));
	if (params.pageSize) qs.set("PageSize", String(params.pageSize));
	return apiRequest<PagedOrders>(`/api/orders?${qs.toString()}`, {
		auth: true,
	});
}

export function getOrderByNumber(orderNumber: string) {
	return apiRequest<OrderDetail>(`/api/orders/${orderNumber}`, {
		auth: true,
	});
}

export function cancelOrder(orderNumber: string) {
	return apiRequest<void>(`/api/orders/${orderNumber}/cancel`, {
		method: "POST",
		auth: true,
	});
}
