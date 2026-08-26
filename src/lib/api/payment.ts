import type { components } from "@/types/api";
import { apiRequest } from "./client";

export type PaymentInitialized = components["schemas"]["PaymentInitializedDto"];
export type PaymentStatus = components["schemas"]["PaymentStatusDto"];

export function initializePayment(orderNumber: string) {
	return apiRequest<PaymentInitialized>("/api/payments/initialize", {
		method: "POST",
		auth: true,
		body: { orderNumber },
	});
}

export function getPaymentStatus(orderNumber: string) {
	return apiRequest<PaymentStatus>(`/api/payments/${orderNumber}/status`, {
		auth: true,
	});
}
