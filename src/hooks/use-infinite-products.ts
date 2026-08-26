import { getProducts } from "@/lib/api/product";
import { ProductFilters } from "@/types";
import { queryKeys } from "@/lib/api/query-keys";
import { toNumber } from "@/lib/utils/format";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useInfiniteProducts(
	filters: Omit<ProductFilters, "page">,
) {
	return useInfiniteQuery({
		queryKey: queryKeys.products(filters),
		queryFn: ({ pageParam }) =>
			getProducts({ ...filters, page: pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			// Sozlesmede hasNext opsiyonel; varsa ona guven.
			if (lastPage.hasNext === false) return undefined;
			if (lastPage.hasNext === true) return allPages.length + 1;

			// Yoksa toplam sayidan hesapla.
			const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
			return loaded < toNumber(lastPage.totalCount)
				? allPages.length + 1
				: undefined;
		},
	});
}
