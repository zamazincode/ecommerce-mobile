import type { components } from "@/types/api";
import type { Address } from "@/types/dtos";
import { apiRequest } from "./client";

type SaveAddressRequest = components["schemas"]["SaveAddressRequest"];

export function getAddresses() {
	return apiRequest<Address[]>("/api/addresses", { auth: true });
}

export function saveAddress(body: SaveAddressRequest) {
	return apiRequest<Address>("/api/addresses", {
		method: "POST",
		auth: true,
		body,
	});
}

export function updateAddress(
	id: number | string,
	body: SaveAddressRequest,
) {
	return apiRequest<Address>(`/api/addresses/${id}`, {
		method: "PUT",
		auth: true,
		body,
	});
}

export function deleteAddress(id: number | string) {
	return apiRequest<void>(`/api/addresses/${id}`, {
		method: "DELETE",
		auth: true,
	});
}
