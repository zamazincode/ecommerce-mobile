import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import Button from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useCart } from "@/hooks/use-cart";
import { useRemoveCartItem } from "@/hooks/use-remove-cart-item";
import { useUpdateCartItem } from "@/hooks/use-update-cart-item";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
	const { data: cart, isLoading, isError, refetch, isRefetching } = useCart();
	const updateItemMutation = useUpdateCartItem();
	const removeItemMutation = useRemoveCartItem();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	if (isLoading) return <LoadingState label="Sepetiniz yükleniyor..." />;
	if (isError) return <ErrorState message="Sepet bilgisi alınamadı." onRetry={refetch} />;

	const items = cart?.items ?? [];

	const handleCheckoutPress = () => {
		if (!isAuthenticated) {
			router.push("/(auth)/login" as any);
		} else {
			router.push("/checkout/address" as any);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<View className="px-5 py-3 bg-white border-b border-neutral-100 flex-row items-center justify-between">
				<Text className="text-xl font-bold text-neutral-900">Sepetim</Text>
				{items.length > 0 && (
					<Text className="text-xs text-neutral-500 font-medium">
						{items.length} farklı ürün
					</Text>
				)}
			</View>

			{items.length === 0 ? (
				<View className="flex-1 justify-center px-4">
					<EmptyState
						title="Sepetiniz Boş"
						description="Sepetinizde henüz ürün bulunmuyor. Binlerce kitap arasından keşfetmeye başlayın."
					/>
					<Button
						onPress={() => router.push("/")}
						className="mx-8 mt-6 bg-dr-red"
					>
						<Text className="text-white font-bold text-center">
							Alışverişe Başla
						</Text>
					</Button>
				</View>
			) : (
				<>
					<FlatList
						data={items}
						keyExtractor={(item) => String(item.productId)}
						contentContainerClassName="p-4 pb-36"
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
						}
						ListHeaderComponent={
							cart?.warnings && cart.warnings.length > 0 ? (
								<View className="mb-4 gap-2">
									{cart.warnings.map((warning, index) => (
										<View
											key={index}
											className="flex-row items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200"
										>
											<Ionicons name="warning-outline" size={18} color="#d97706" />
											<Text className="text-xs font-semibold text-amber-800 flex-1">
												{warning}
											</Text>
										</View>
									))}
								</View>
							) : null
						}
						renderItem={({ item }) => (
							<CartItemRow
								item={item}
								onUpdateQuantity={(quantity) =>
									updateItemMutation.mutate({
										productId: item.productId,
										quantity,
									})
								}
								onRemove={() => removeItemMutation.mutate(item.productId)}
								isPending={
									updateItemMutation.isPending || removeItemMutation.isPending
								}
							/>
						)}
						ListFooterComponent={<CartSummary cart={cart!} />}
					/>

					{/* Sabit Alt Bar: Siparişi Tamamla */}
					<SafeAreaView
						edges={["bottom"]}
						className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 px-5 py-3 shadow-lg flex-row items-center justify-between"
					>
						<View>
							<Text className="text-xs text-neutral-500 font-medium">
								Ödenecek Tutar
							</Text>
							<Text className="text-xl font-bold text-dr-red">
								{formatPrice(cart?.total ?? 0)}
							</Text>
						</View>

						<Button
							onPress={handleCheckoutPress}
							className="px-6 py-3.5 bg-dr-red rounded-xl"
						>
							<Text className="text-white font-bold text-base">
								{isAuthenticated ? "Siparişi Tamamla" : "Giriş Yap ve Devam Et"}
							</Text>
						</Button>
					</SafeAreaView>
				</>
			)}
		</SafeAreaView>
	);
}
