import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import Button from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const {
		data: favorites,
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useFavorites();

	if (!isAuthenticated) {
		return (
			<SafeAreaView className="flex-1 bg-white items-center justify-center px-8" edges={["top"]}>
				<View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4 border border-red-100">
					<Feather name="heart" size={28} color="#E30613" />
				</View>
				<Text className="text-xl font-bold text-neutral-900 text-center">
					Favorilerinizi Görün
				</Text>
				<Text className="text-sm text-neutral-500 text-center mt-2 leading-5 mb-6">
					Beğendiğiniz kitapları favorilerinize eklemek ve kolayca takip etmek için giriş yapın.
				</Text>
				<Button
					onPress={() => router.push("/(auth)/login" as any)}
					className="w-full h-12 justify-center bg-dr-red"
				>
					<Text className="text-white font-bold text-base">Giriş Yap</Text>
				</Button>
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
				<ErrorState
					message="Favorileriniz yüklenemedi."
					onRetry={refetch}
				/>
			</SafeAreaView>
		);
	}

	const favoriteProducts = favorites ?? [];

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<View className="px-5 py-3 bg-white border-b border-neutral-100 flex-row items-center justify-between">
				<Text className="text-xl font-bold text-neutral-900">Favorilerim</Text>
				{favoriteProducts.length > 0 && (
					<Text className="text-xs text-neutral-500 font-medium">
						{favoriteProducts.length} ürün
					</Text>
				)}
			</View>

			{isLoading ? (
				<View className="flex-row flex-wrap gap-3 p-4">
					{[0, 1, 2, 3].map((i) => (
						<View key={i} className="flex-1" style={{ minWidth: "45%" }}>
							<ProductCardSkeleton />
						</View>
					))}
				</View>
			) : favoriteProducts.length === 0 ? (
				<View className="flex-1 justify-center px-4">
					<EmptyState
						title="Favori Ürününüz Yok"
						description="Kalp ikonuna dokunarak beğendiğiniz ürünleri buraya ekleyebilirsiniz."
					/>
					<Button
						onPress={() => router.push("/")}
						className="mx-8 mt-6 bg-dr-red"
					>
						<Text className="text-white font-bold text-center">
							Ürünleri Keşfet
						</Text>
					</Button>
				</View>
			) : (
				<FlatList
					data={favoriteProducts}
					keyExtractor={(item) => String(item.id)}
					numColumns={2}
					columnWrapperClassName="gap-3 px-4"
					contentContainerClassName="gap-4 py-4"
					refreshControl={
						<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
					}
					renderItem={({ item }) => (
						<View className="flex-1">
							<ProductCard product={item} />
						</View>
					)}
				/>
			)}
		</SafeAreaView>
	);
}
