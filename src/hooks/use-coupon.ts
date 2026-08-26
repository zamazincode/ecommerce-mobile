import { applyCoupon, removeCoupon } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import type { Cart } from "@/types/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useApplyCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (code: string) => applyCoupon(code),
		onSuccess: (cart: Cart) => {
			queryClient.setQueryData(queryKeys.cart, cart);
		},
	});
}

export function useRemoveCoupon() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => removeCoupon(),
		onSuccess: (cart: Cart) => {
			queryClient.setQueryData(queryKeys.cart, cart);
		},
	});
}
