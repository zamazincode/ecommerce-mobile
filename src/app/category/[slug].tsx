import ProductCard from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { EmptyState, ErrorState, ListFooter } from "@/components/ui/states";
import { useInfiniteCategoryProducts } from "@/hooks/use-infinite-category-products";
import type { ProductFilters } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryProductsScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
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
	} = useInfiniteCategoryProducts(slug ?? "", filters);

	const products = data?.pages.flatMap((page) => page.items) ?? [];

	const formatSlugToTitle = (s?: string) => {
		if (!s) return "Kategori";
		return s
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	if (isError) return <ErrorState message="Kategori ürünleri yüklenemedi." onRetry={refetch} />;

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<Stack.Screen
				options={{
					title: formatSlugToTitle(slug),
					headerShown: true,
					headerBackTitle: "Geri",
				}}
			/>

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
				ListFooterComponent={<ListFooter visible={isFetchingNextPage} />}
				ListEmptyComponent={
					isLoading ? (
						<GridSkeleton />
					) : (
						<EmptyState
							title="Ürün bulunamadı"
							description="Bu kategoride henüz ürün bulunmuyor."
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
