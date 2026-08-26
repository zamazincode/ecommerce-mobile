import { getFavoriteIds } from "@/lib/api/favorite";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useFavoriteIds() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery({
		queryKey: queryKeys.favoriteIds,
		queryFn: getFavoriteIds,
		enabled: isAuthenticated, // Misafirde hiç istek atma
		staleTime: 5 * 60 * 1000,
		// Dizi yerine Set döndür: includes O(n), Set.has O(1)
		select: (ids) => new Set(ids.map(Number)),
	});
}

export default useFavoriteIds;
