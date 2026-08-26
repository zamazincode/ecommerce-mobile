import {
	cancelOrder,
	getOrderByNumber,
	getOrders,
} from "@/lib/api/order";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

const PAGE_SIZE = 10;

export function useInfiniteOrders() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useInfiniteQuery({
		queryKey: ["orders", "infinite"],
		queryFn: ({ pageParam }) =>
			getOrders({ page: pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.hasNext === false) return undefined;
			if (lastPage.hasNext === true) return allPages.length + 1;
			return undefined;
		},
		enabled: isAuthenticated,
	});
}

export function useOrderDetail(orderNumber?: string) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery({
		queryKey: ["order", orderNumber],
		queryFn: () => getOrderByNumber(orderNumber!),
		enabled: isAuthenticated && Boolean(orderNumber),
	});
}

export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderNumber: string) => cancelOrder(orderNumber),
		onSuccess: (_data, orderNumber) => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
			queryClient.invalidateQueries({ queryKey: queryKeys.cart });
		},
	});
}
