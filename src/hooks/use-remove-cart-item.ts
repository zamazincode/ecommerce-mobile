import { removeCartItem } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import type { Cart } from "@/types/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: number | string) => removeCartItem(productId),
		onSuccess: (cart: Cart) => {
			queryClient.setQueryData(queryKeys.cart, cart);
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart });
		},
	});
}

export default useRemoveCartItem;
