import { removeCartItem, updateCartItem } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import type { Cart } from "@/types/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: number | string;
			quantity: number;
		}) => {
			if (quantity <= 0) {
				return removeCartItem(productId);
			}
			return updateCartItem(productId, quantity);
		},

		onMutate: async ({ productId, quantity }) => {
			// 1) Uçuşta olan sepet sorgularını durdur ki cevapları bizi ezmesin
			await queryClient.cancelQueries({ queryKey: queryKeys.cart });

			// 2) Mevcut hali sakla (geri alma için)
			const previous = queryClient.getQueryData<Cart>(queryKeys.cart);

			// 3) Arayüzü şimdiden güncelle (optimistic)
			queryClient.setQueryData<Cart>(queryKeys.cart, (old) => {
				if (!old) return old;
				if (quantity <= 0) {
					return {
						...old,
						items: old.items.filter(
							(i) => String(i.productId) !== String(productId),
						),
					};
				}
				return {
					...old,
					items: old.items.map((i) =>
						String(i.productId) === String(productId)
							? { ...i, quantity }
							: i,
					),
				};
			});

			return { previous };
		},

		onError: (_err, _vars, context) => {
			// Hata durumunda önceki duruma geri dön
			if (context?.previous) {
				queryClient.setQueryData(queryKeys.cart, context.previous);
			}
		},

		onSettled: (data) => {
			if (data) {
				queryClient.setQueryData(queryKeys.cart, data);
			} else {
				queryClient.invalidateQueries({ queryKey: queryKeys.cart });
			}
		},
	});
}

export default useUpdateCartItem;
