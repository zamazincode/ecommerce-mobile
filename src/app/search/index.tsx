import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import SearchBar from "@/components/search-bar";
import { EmptyState, ErrorState, ListFooter } from "@/components/ui/states";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteSearch } from "@/hooks/use-infinite-search";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
	FlatList,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
	const [query, setQuery] = useState("");
	const [submitted, setSubmitted] = useState("");

	const debouncedQuery = useDebouncedValue(query, 300);

	const { data: suggestions } =
		useSearchSuggestions(debouncedQuery);

	const {
		data: searchData,
		isLoading: isSearchLoading,
		isError,
		refetch,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteSearch({ q: submitted });

	const searchResults =
		searchData?.pages.flatMap((page) => page.results.items) ?? [];
	const didYouMean = searchData?.pages[0]?.didYouMean;

	const handleSearchSubmit = (term?: string) => {
		const textToSearch = (term ?? query).trim();
		if (textToSearch.length > 0) {
			setSubmitted(textToSearch);
		}
	};

	const showSuggestions =
		submitted !== query &&
		query.trim().length > 1 &&
		Boolean(suggestions && suggestions.length > 0);

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>

			{/* Üst Arama Çubuğu + Geri Butonu */}
			<View className="flex-row items-center pr-2">
				<Pressable
					onPress={() => router.back()}
					hitSlop={8}
					className="pl-4 py-2"
				>
					<Ionicons name="arrow-back" size={24} color="#1f2937" />
				</Pressable>
				<View className="flex-1">
					<SearchBar
						value={query}
						onChangeText={(t) => setQuery(t)}
						onSubmitEditing={() => handleSearchSubmit()}
						onSearch={(t) => {
							if (t === "") {
								setSubmitted("");
							}
						}}
						autoFocus
					/>
				</View>
			</View>

			{/* Öneri Listesi (Autocomplete) */}
			{showSuggestions ? (
				<FlatList
					data={suggestions ?? []}
					keyExtractor={(item) => item.slug}
					keyboardShouldPersistTaps="handled"
					contentContainerClassName="py-2"
					renderItem={({ item }) => (
						<Pressable
							onPress={() => {
								router.push(`/product/${item.slug}`);
							}}
							className="flex-row items-center justify-between px-5 py-3.5 border-b border-neutral-100 active:bg-neutral-50"
						>
							<View className="flex-row items-center gap-3 flex-1">
								{item.imageUrl ? (
									<Image
										source={item.imageUrl}
										contentFit="cover"
										style={{ width: 36, height: 48, borderRadius: 6 }}
									/>
								) : (
									<View className="w-9 h-12 rounded-md bg-neutral-100 items-center justify-center">
										<Feather name="search" size={16} color="#9ca3af" />
									</View>
								)}
								<Text
									numberOfLines={2}
									className="text-sm font-medium text-neutral-800 flex-1"
								>
									{item.name}
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={16} color="#9ca3af" />
						</Pressable>
					)}
				/>
			) : submitted.length > 0 ? (
				/* Arama Sonuçları Listesi */
				isError ? (
					<ErrorState
						message="Arama sonuçları yüklenemedi."
						onRetry={refetch}
					/>
				) : (
					<FlatList
						data={searchResults}
						keyExtractor={(item) => String(item.id)}
						numColumns={2}
						columnWrapperClassName="gap-3 px-4"
						contentContainerClassName="gap-4 py-4"
						keyboardShouldPersistTaps="handled"
						refreshing={isRefetching}
						onRefresh={refetch}
						onEndReached={() => {
							if (hasNextPage && !isFetchingNextPage) fetchNextPage();
						}}
						onEndReachedThreshold={0.5}
						ListHeaderComponent={
							didYouMean && searchResults.length === 0 ? (
								<Pressable
									onPress={() => {
										setQuery(didYouMean);
										setSubmitted(didYouMean);
									}}
									className="bg-amber-50 px-4 py-3 rounded-xl mb-4 border border-amber-200"
								>
									<Text className="text-sm text-neutral-700">
										Bunu mu demek istediniz:{" "}
										<Text className="text-dr-red font-bold">
											{didYouMean}
										</Text>
									</Text>
								</Pressable>
							) : null
						}
						renderItem={({ item }) => (
							<View className="flex-1">
								<ProductCard product={item} />
							</View>
						)}
						ListFooterComponent={
							<ListFooter visible={isFetchingNextPage} />
						}
						ListEmptyComponent={
							isSearchLoading ? (
								<GridSkeleton />
							) : (
								<EmptyState
									title="Sonuç bulunamadı"
									description={`"${submitted}" için ürün bulunamadı. Farklı bir kelime deneyin.`}
								/>
							)
						}
						initialNumToRender={6}
						windowSize={7}
						removeClippedSubviews
					/>
				)
			) : (
				/* Henüz arama yapılmadığında boş durum / ipucu */
				<View className="flex-1 items-center justify-center px-8 py-16">
					<View className="w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-4">
						<Feather name="search" size={28} color="#9ca3af" />
					</View>
					<Text className="text-base font-bold text-neutral-800 text-center">
						Binlerce Ürün Arasında Arayın
					</Text>
					<Text className="text-xs text-neutral-400 text-center mt-1.5 leading-5">
						Kitap adı, yazar, yayınevi veya kategori yazarak hızlıca bulabilirsiniz.
					</Text>
				</View>
			)}
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
