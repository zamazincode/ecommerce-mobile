import { addCartItem } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import type { Cart } from "@/types/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity = 1,
		}: {
			productId: number | string;
			quantity?: number;
		}) => addCartItem(productId, quantity),
		onSuccess: (cart: Cart) => {
			// Sunucu güncel sepeti döndürdüğü için cache'i doğrudan güncelliyoruz
			queryClient.setQueryData(queryKeys.cart, cart);
		},
	});
}

export default useAddToCart;
