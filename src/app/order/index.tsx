import Button from "@/components/ui/button";
import { EmptyState, ErrorState, ListFooter, LoadingState } from "@/components/ui/states";
import { useInfiniteOrders } from "@/hooks/use-orders";
import { formatDate, formatPrice, toNumber } from "@/lib/utils/format";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import {
	FlatList,
	Pressable,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function getOrderStatusConfig(status?: number | string | null) {
	const s = String(status).toLowerCase();
	if (s === "0" || s === "pending") {
		return { label: "Ödeme Bekliyor", color: "#d97706", bg: "#fef3c7" };
	}
	if (s === "1" || s === "processing" || s === "paid") {
		return { label: "Hazırlanıyor", color: "#2563eb", bg: "#dbeafe" };
	}
	if (s === "2" || s === "shipped") {
		return { label: "Kargoda", color: "#7c3aed", bg: "#ede9fe" };
	}
	if (s === "3" || s === "delivered") {
		return { label: "Teslim Edildi", color: "#059669", bg: "#d1fae5" };
	}
	if (s === "4" || s === "cancelled") {
		return { label: "İptal Edildi", color: "#dc2626", bg: "#fee2e2" };
	}
	return { label: "İşleniyor", color: "#4b5563", bg: "#f3f4f6" };
}

export default function OrderListScreen() {
	const {
		data,
		isLoading,
		isError,
		refetch,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteOrders();

	if (isLoading) return <LoadingState label="Siparişleriniz yükleniyor..." />;
	if (isError) return <ErrorState message="Siparişler alınamadı." onRetry={refetch} />;

	const orders = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<Stack.Screen
				options={{
					title: "Siparişlerim",
					headerShown: true,
					headerBackTitle: "Profil",
				}}
			/>

			{orders.length === 0 ? (
				<View className="flex-1 justify-center px-4">
					<EmptyState
						title="Henüz Siparişiniz Yok"
						description="Verdiğiniz tüm siparişlerin durumunu bu sayfadan kolayca takip edebilirsiniz."
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
				<FlatList
					data={orders}
					keyExtractor={(item) => item.orderNumber}
					contentContainerClassName="p-4 gap-3"
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
					}
					onEndReached={() => {
						if (hasNextPage && !isFetchingNextPage) fetchNextPage();
					}}
					onEndReachedThreshold={0.5}
					ListFooterComponent={<ListFooter visible={isFetchingNextPage} />}
					renderItem={({ item }) => {
						const statusConfig = getOrderStatusConfig(item.status);
						return (
							<Pressable
								onPress={() => router.push(`/order/${item.orderNumber}` as any)}
								className="bg-white p-4 rounded-2xl border border-neutral-100 active:bg-neutral-50 shadow-sm"
							>
								<View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
									<View className="flex-row items-center gap-2">
										<Feather name="package" size={18} color="#002B49" />
										<Text className="text-sm font-bold text-neutral-900">
											#{item.orderNumber}
										</Text>
									</View>
									<View
										style={{ backgroundColor: statusConfig.bg }}
										className="px-2.5 py-1 rounded-full"
									>
										<Text
											style={{ color: statusConfig.color }}
											className="text-xs font-bold"
										>
											{statusConfig.label}
										</Text>
									</View>
								</View>

								<View className="flex-row items-center justify-between pt-3">
									<View>
										<Text className="text-xs text-neutral-400">
											{formatDate(item.createdAt)}
										</Text>
										<Text className="text-xs text-neutral-600 mt-0.5">
											{item.totalQuantity} ürün
										</Text>
									</View>

									<View className="flex-row items-center gap-1.5">
										<Text className="text-base font-bold text-dr-red">
											{formatPrice(toNumber(item.total))}
										</Text>
										<Ionicons
											name="chevron-forward"
											size={16}
											color="#9ca3af"
										/>
									</View>
								</View>
							</Pressable>
						);
					}}
				/>
			)}
		</SafeAreaView>
	);
}
