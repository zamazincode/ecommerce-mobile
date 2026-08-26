import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { BookDetailTable } from "@/components/product/book-detail-table";
import { FavoriteButton } from "@/components/product/favorite-button";
import { PriceBlock } from "@/components/product/price-block";
import { ProductGallery } from "@/components/product/product-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { StockBadge } from "@/components/product/stock-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { useProduct } from "@/hooks/use-product";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const { data: product, isLoading, isError, refetch, isRefetching } = useProduct(slug);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
				<ProductDetailSkeleton />
			</SafeAreaView>
		);
	}

	if (isError || !product) {
		return (
			<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
				<ErrorState
					message="Ürün bilgisi yüklenemedi."
					onRetry={refetch}
				/>
			</SafeAreaView>
		);
	}

	// Hazırlanan görsel listesi (imageUrls yoksa fallback olarak tek imageUrl)
	const galleryImages =
		product.imageUrls && product.imageUrls.length > 0
			? product.imageUrls
			: [];

	return (
		<View className="flex-1 bg-white">
			<Stack.Screen
				options={{
					title: product.name,
					headerShown: true,
					headerBackTitle: "Geri",
				}}
			/>

			<ScrollView
				contentContainerClassName="pb-36"
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
				}
			>
				{/* 1. Görsel Galerisi */}
				<ProductGallery images={galleryImages} />

				<View className="px-4 pt-4">
					{/* Kategori & Yayınevi / Marka Etiketleri */}
					<View className="flex-row flex-wrap items-center gap-2 mb-2">
						{product.category && (
							<View className="bg-neutral-100 px-2.5 py-1 rounded-md">
								<Text className="text-xs font-medium text-neutral-600">
									{product.category.name}
								</Text>
							</View>
						)}
						{product.publisher && (
							<View className="bg-neutral-100 px-2.5 py-1 rounded-md">
								<Text className="text-xs font-medium text-neutral-600">
									{product.publisher.name}
								</Text>
							</View>
						)}
						{product.brand && (
							<View className="bg-neutral-100 px-2.5 py-1 rounded-md">
								<Text className="text-xs font-medium text-neutral-600">
									{product.brand.name}
								</Text>
							</View>
						)}
					</View>

					{/* Ürün Adı */}
					<Text className="text-xl font-bold text-neutral-900 leading-7">
						{product.name}
					</Text>

					{/* Yazarlar */}
					{product.authors && product.authors.length > 0 && (
						<Text className="text-sm text-neutral-500 font-medium mt-1">
							{product.authors.map((a) => a.name).join(", ")}
						</Text>
					)}

					{/* Fiyat Bloğu */}
					<PriceBlock
						price={product.price}
						effectivePrice={product.effectivePrice}
					/>

					{/* Stok Durumu Rozeti */}
					<StockBadge inStock={product.inStock} stock={product.stock} />

					{/* Açıklama */}
					{product.description && (
						<View className="my-5 pt-4 border-t border-neutral-100">
							<Text className="text-base font-bold text-neutral-900 mb-2">
								Ürün Açıklaması
							</Text>
							<Text
								numberOfLines={isDescriptionExpanded ? undefined : 4}
								className="text-sm text-neutral-600 leading-6"
							>
								{product.description}
							</Text>
							{product.description.length > 180 && (
								<Pressable
									onPress={() => setIsDescriptionExpanded((prev) => !prev)}
									className="pt-2"
								>
									<Text className="text-sm font-semibold text-dr-red">
										{isDescriptionExpanded ? "Daha az göster" : "Devamını oku"}
									</Text>
								</Pressable>
							)}
						</View>
					)}

					{/* Kitap Detay Tablosu (Varsa) */}
					{product.bookDetail ? (
						<BookDetailTable detail={product.bookDetail} />
					) : null}
				</View>

				{/* İlgili / Benzer Ürünler (Bağlı component) */}
				<RelatedProducts productId={product.id} />
			</ScrollView>

			{/* Sabit Alt Çubuk (Favori + Sepete Ekle) */}
			<SafeAreaView
				edges={["bottom"]}
				className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 px-4 py-3 shadow-lg flex-row items-center gap-3"
			>
				<FavoriteButton productId={product.id} />
				<View className="flex-1">
					<AddToCartButton
						productId={product.id}
						disabled={!product.inStock}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
}

function ProductDetailSkeleton() {
	return (
		<View className="p-4 gap-4">
			<Skeleton className="w-full aspect-square rounded-2xl" />
			<Skeleton className="h-6 w-3/4 rounded-lg" />
			<Skeleton className="h-4 w-1/2 rounded-lg" />
			<Skeleton className="h-8 w-1/3 rounded-lg" />
			<Skeleton className="h-5 w-1/4 rounded-lg" />
			<Skeleton className="h-24 w-full rounded-xl mt-4" />
		</View>
	);
}
