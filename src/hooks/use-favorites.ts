import { getFavorites } from "@/lib/api/favorite";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useFavorites() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery({
		queryKey: queryKeys.favorites,
		queryFn: getFavorites,
		enabled: isAuthenticated,
		staleTime: 60 * 1000,
	});
}

export default useFavorites;
