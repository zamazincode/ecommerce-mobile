import { getSuggestions } from "@/lib/api/search";
import { useQuery } from "@tanstack/react-query";

export function useSearchSuggestions(term: string) {
	return useQuery({
		queryKey: ["search-suggest", term],
		queryFn: () => getSuggestions(term),
		enabled: term.trim().length > 1, // 0-1 karakterde istek atma
		staleTime: 60 * 1000,
	});
}

export default useSearchSuggestions;
