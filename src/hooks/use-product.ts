import { getProductBySlug } from "@/lib/api/product";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useProduct(slug: string | undefined) {
	return useQuery({
		queryKey: queryKeys.product(slug ?? ""),
		queryFn: () => getProductBySlug(slug!),
		enabled: Boolean(slug),
	});
}

export default useProduct;
