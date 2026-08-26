import { getCart } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useCart() {
	return useQuery({
		queryKey: queryKeys.cart,
		queryFn: getCart,
		staleTime: 0, // Sepet her zaman taze olmalı
	});
}

export default useCart;
