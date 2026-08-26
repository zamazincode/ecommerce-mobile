import ProductCard from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { EmptyState, ErrorState, ListFooter } from "@/components/ui/states";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { ProductFilters } from "@/types";
import { FlatList, View } from "react-native";

type Props = {
	filters: Omit<ProductFilters, "page">;
	ListHeaderComponent?: React.ReactElement;
};

export function ProductGrid({ filters, ListHeaderComponent }: Props) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useInfiniteProducts(filters);

	const products = data?.pages.flatMap((page) => page.items) ?? [];

	if (isError) return <ErrorState onRetry={refetch} />;

	return (
		<FlatList
			data={products}
			keyExtractor={(item) => String(item.id)}
			renderItem={({ item }) => (
				<View className="flex-1">
					<ProductCard product={item} />
				</View>
			)}
			numColumns={2}
			columnWrapperClassName="gap-3 px-4"
			contentContainerClassName="gap-4 py-4"
			ListHeaderComponent={ListHeaderComponent}
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
