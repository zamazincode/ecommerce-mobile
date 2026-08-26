import { getCategoryTree } from "@/lib/api/category";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
	return useQuery({
		queryKey: queryKeys.categories,
		queryFn: getCategoryTree,
		staleTime: 10 * 60 * 1000, // Kategoriler nadiren değişir (10 dk)
	});
}

export default useCategories;
