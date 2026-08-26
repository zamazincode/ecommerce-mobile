import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import ProductCard from "@/components/product/product-card";
import { EmptyState, ErrorState, ListFooter } from "@/components/ui/states";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { ProductFilters } from "@/types";
import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductListScreen() {
	// TODO: filtre modali eklenince useState'e cevir
	const filters: Omit<ProductFilters, "page"> = {};

	const {
		data,
		isLoading,
		isError,
		refetch,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteProducts(filters);

	const products = data?.pages.flatMap((page) => page.items) ?? [];

	if (isError) return <ErrorState onRetry={refetch} />;

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<Stack.Screen options={{ title: "Ürünler" }} />
			<FlatList
				data={products}
				keyExtractor={(item) => String(item.id)}
				numColumns={2}
				columnWrapperClassName="gap-3 px-4"
				contentContainerClassName="gap-4 py-4"
				renderItem={({ item }) => (
					<View className="flex-1">
						<ProductCard product={item} />
					</View>
				)}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) fetchNextPage();
				}}
				onEndReachedThreshold={0.5}
				refreshing={isRefetching}
				onRefresh={refetch}
				ListFooterComponent={
					<ListFooter visible={isFetchingNextPage} />
				}
				ListEmptyComponent={
					isLoading ? (
						<GridSkeleton />
					) : (
						<EmptyState
							title="Ürün bulunamadı"
							description="Filtreleri gevşetmeyi deneyin."
						/>
					)
				}
				initialNumToRender={6}
				windowSize={7}
				removeClippedSubviews
			/>
		</SafeAreaView>
	);
}

function GridSkeleton() {
	return (
		<View className="flex-row flex-wrap gap-3 px-4">
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<View key={i} className="flex-1" style={{ minWidth: "45%" }}>
					<ProductCardSkeleton />
				</View>
			))}
		</View>
	);
}
