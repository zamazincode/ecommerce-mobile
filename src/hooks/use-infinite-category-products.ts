import { getCategoryProducts } from "@/lib/api/category";
import { queryKeys } from "@/lib/api/query-keys";
import { toNumber } from "@/lib/utils/format";
import type { ProductFilters } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useInfiniteCategoryProducts(
	slug: string,
	filters: Omit<ProductFilters, "page">,
) {
	return useInfiniteQuery({
		queryKey: queryKeys.category(slug, filters),
		queryFn: ({ pageParam }) =>
			getCategoryProducts(slug, {
				...filters,
				page: pageParam,
				pageSize: PAGE_SIZE,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.hasNext === false) return undefined;
			if (lastPage.hasNext === true) return allPages.length + 1;

			const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
			return loaded < toNumber(lastPage.totalCount)
				? allPages.length + 1
				: undefined;
		},
		enabled: Boolean(slug), // slug gelmeden istek atma
	});
}

export default useInfiniteCategoryProducts;
