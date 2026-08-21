import { getHome } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useHome() {
	return useQuery({
		queryKey: queryKeys.home,
		queryFn: getHome,
		staleTime: 5 * 60 * 1000,
	});
}
