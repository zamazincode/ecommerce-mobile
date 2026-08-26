import { deleteAddress, saveAddress, updateAddress } from "@/lib/api/address";
import { queryKeys } from "@/lib/api/query-keys";
import type { AddressFormValues } from "@/lib/validation/address";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSaveAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id?: number | string;
			data: AddressFormValues;
		}) => {
			if (id) {
				return updateAddress(id, data);
			}
			return saveAddress(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
		},
	});
}

export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number | string) => deleteAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
		},
	});
}
