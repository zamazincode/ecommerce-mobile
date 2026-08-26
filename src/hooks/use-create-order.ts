import { createOrder, type CreateOrderRequest } from "@/lib/api/order";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			payload,
			idempotencyKey,
		}: {
			payload: CreateOrderRequest;
			idempotencyKey: string;
		}) => createOrder(payload, idempotencyKey),
		retry: false, // Sipariş oluşturmayı ASLA otomatik tekrarlama
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}

export default useCreateOrder;
