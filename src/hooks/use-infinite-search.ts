import { searchProducts, type SearchParams } from "@/lib/api/search";
import { queryKeys } from "@/lib/api/query-keys";
import { toNumber } from "@/lib/utils/format";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export function useInfiniteSearch(
	params: Omit<SearchParams, "page">,
) {
	return useInfiniteQuery({
		queryKey: queryKeys.search(params),
		queryFn: ({ pageParam }) =>
			searchProducts({ ...params, page: pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const results = lastPage.results;
			if (results.hasNext === false) return undefined;
			if (results.hasNext === true) return allPages.length + 1;

			const loaded = allPages.reduce(
				(sum, p) => sum + p.results.items.length,
				0,
			);
			return loaded < toNumber(results.totalCount)
				? allPages.length + 1
				: undefined;
		},
		enabled: Boolean(params.q && params.q.trim().length > 0),
	});
}

export default useInfiniteSearch;
