import { getRelatedProducts } from "@/lib/api/product";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useRelatedProducts(productId: number | string | undefined) {
	return useQuery({
		queryKey: queryKeys.relatedProducts(productId ?? ""),
		queryFn: () => getRelatedProducts(productId!),
		enabled: Boolean(productId), // once urun gelsin, sonra ilgili urunler
	});
}

export default useRelatedProducts;
