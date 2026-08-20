import { getProducts, ProductFilters } from "@/lib/api/product";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useProducts(filters: ProductFilters) {
	return useQuery({
		queryKey: queryKeys.products(filters),
		queryFn: () => getProducts(filters),
	});
}
