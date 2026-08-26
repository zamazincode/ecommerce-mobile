import { addFavorite, removeFavorite } from "@/lib/api/favorite";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFavoriteIds } from "./use-favorite-ids";

export function useFavoriteToggle(productId: number | string) {
	const queryClient = useQueryClient();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const { data: favoriteIds } = useFavoriteIds();

	const numId = Number(productId);
	const isFavorite = favoriteIds?.has(numId) ?? false;

	const mutation = useMutation({
		mutationFn: () => (isFavorite ? removeFavorite(numId) : addFavorite(numId)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.favoriteIds });
			queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
		},
	});

	return {
		isFavorite,
		toggle: mutation.mutate,
		isPending: mutation.isPending,
		isAuthenticated,
	};
}

export default useFavoriteToggle;
