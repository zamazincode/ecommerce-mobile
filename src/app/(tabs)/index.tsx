import { apiRequest } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import { components } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { RefreshControl, ScrollView } from "react-native";

export default function Index() {
	const { data, isLoading, isError, refetch, isRefetching } = useQuery({
		queryKey: queryKeys.home,
		queryFn: () =>
			apiRequest<components["schemas"]["HomeDto"][]>(`/api/home`),
	});

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
			}
		>
			{/* hero, kampanya blokları, ürün carousel'leri */}
		</ScrollView>
	);
}
