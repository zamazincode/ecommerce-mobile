import Button from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useCancelOrder, useOrderDetail } from "@/hooks/use-orders";
import { formatDate, formatPrice, toNumber } from "@/lib/utils/format";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
	Alert,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOrderStatusConfig } from "./index";

export default function OrderDetailScreen() {
	const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
	const { data: order, isLoading, isError, refetch } = useOrderDetail(orderNumber);
	const cancelOrderMutation = useCancelOrder();

	if (isLoading) return <LoadingState label="Sipariş detayları yükleniyor..." />;
	if (isError || !order) {
		return (
			<SafeAreaView className="flex-1 bg-white p-4 justify-center" edges={["top"]}>
				<ErrorState
					message="Sipariş detayları bulunamadı."
					onRetry={refetch}
				/>
			</SafeAreaView>
		);
	}

	const statusConfig = getOrderStatusConfig(order.status);
	const subTotal = toNumber(order.subTotal);
	const discountAmount = toNumber(order.discountAmount);
	const shippingCost = toNumber(order.shippingCost);
	const total = toNumber(order.total);

	const handleCancelPress = () => {
		Alert.alert(
			"Siparişi İptal Et",
			"Bu siparişi iptal etmek istediğinizden emin misiniz?",
			[
				{ text: "Vazgeç", style: "cancel" },
				{
					text: "İptal Et",
					style: "destructive",
					onPress: () => {
						cancelOrderMutation.mutate(order.orderNumber, {
							onSuccess: () => {
								Alert.alert("Başarılı", "Siparişiniz iptal edildi.");
							},
							onError: () => {
								Alert.alert("Hata", "Sipariş iptal edilemedi.");
							},
						});
					},
				},
			],
		);
	};

	// 4 Adımlı İlerleme Durumu: 0: Alındı, 1: Hazırlanıyor, 2: Kargoda, 3: Teslim Edildi
	const statusCode = Number(order.status);
	const isCancelled = statusCode === 4 || String(order.status).toLowerCase() === "cancelled";

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<Stack.Screen
				options={{
					title: `Sipariş #${order.orderNumber}`,
					headerShown: true,
					headerBackTitle: "Siparişler",
				}}
			/>

			<ScrollView
				contentContainerClassName="p-4 pb-28 gap-4"
				showsVerticalScrollIndicator={false}
			>
				{/* Sipariş Başlığı ve Durum Rozeti */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100">
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-xs text-neutral-400">
								{formatDate(order.createdAt)}
							</Text>
							<Text className="text-lg font-bold text-neutral-900 mt-0.5">
								#{order.orderNumber}
							</Text>
						</View>
						<View
							style={{ backgroundColor: statusConfig.bg }}
							className="px-3 py-1.5 rounded-full"
						>
							<Text
								style={{ color: statusConfig.color }}
								className="text-xs font-bold"
							>
								{statusConfig.label}
							</Text>
						</View>
					</View>

					{/* Durum Zaman Çizelgesi (İptal edilmediyse) */}
					{!isCancelled && (
						<View className="flex-row items-center justify-between mt-6 pt-4 border-t border-neutral-100">
							{[
								{ label: "Alındı", step: 0 },
								{ label: "Hazırlanıyor", step: 1 },
								{ label: "Kargoda", step: 2 },
								{ label: "Teslim", step: 3 },
							].map((s, idx, arr) => {
								const isReached = statusCode >= s.step;
								return (
									<View key={s.step} className="items-center flex-1">
										<View
											className={`w-7 h-7 rounded-full items-center justify-center ${
												isReached ? "bg-emerald-500" : "bg-neutral-200"
											}`}
										>
											<Ionicons
												name="checkmark"
												size={16}
												color="#ffffff"
											/>
										</View>
										<Text
											className={`text-[10px] mt-1.5 font-medium text-center ${
												isReached ? "text-emerald-700 font-bold" : "text-neutral-400"
											}`}
										>
											{s.label}
										</Text>
									</View>
								);
							})}
						</View>
					)}
				</View>

				{/* Teslimat Adresi */}
				{order.shippingAddress && (
					<View className="bg-white p-4 rounded-2xl border border-neutral-100">
						<View className="flex-row items-center gap-2 mb-2">
							<Ionicons name="location-outline" size={18} color="#E30613" />
							<Text className="text-sm font-bold text-neutral-900">
								Teslimat Adresi
							</Text>
						</View>
						<Text className="text-sm font-semibold text-neutral-800">
							{order.shippingAddress.fullName} • {order.shippingAddress.phone}
						</Text>
						<Text className="text-xs text-neutral-500 mt-1 leading-5">
							{order.shippingAddress.fullAddress}
						</Text>
						<Text className="text-xs font-medium text-neutral-700 mt-0.5">
							{order.shippingAddress.district} / {order.shippingAddress.city}
						</Text>
					</View>
				)}

				{/* Ürünler Listesi */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100">
					<Text className="text-sm font-bold text-neutral-900 mb-3">
						Sipariş Edilen Ürünler ({order.items.length})
					</Text>

					<View className="gap-3">
						{order.items.map((item) => (
							<View
								key={String(item.productId)}
								className="flex-row items-center gap-3 pb-3 border-b border-neutral-100"
							>
								<View className="w-11 h-14 rounded-md bg-neutral-100 items-center justify-center">
									<Feather name="book" size={18} color="#9ca3af" />
								</View>
								<View className="flex-1">
									<Text
										numberOfLines={2}
										className="text-sm font-medium text-neutral-900 leading-5"
									>
										{item.productName}
									</Text>
									<Text className="text-xs text-neutral-500 mt-1">
										{item.quantity} adet x {formatPrice(item.unitPrice)}
									</Text>
								</View>
								<Text className="text-sm font-bold text-neutral-900">
									{formatPrice(item.lineTotal)}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Fiyat Detayları */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100 gap-2.5">
					<Text className="text-sm font-bold text-neutral-900 mb-1">
						Ödeme Özeti
					</Text>

					<View className="flex-row justify-between">
						<Text className="text-sm text-neutral-600">Ara Toplam</Text>
						<Text className="text-sm font-semibold text-neutral-900">
							{formatPrice(subTotal)}
						</Text>
					</View>

					{discountAmount > 0 && (
						<View className="flex-row justify-between">
							<Text className="text-sm text-emerald-600">İndirim</Text>
							<Text className="text-sm font-semibold text-emerald-600">
								-{formatPrice(discountAmount)}
							</Text>
						</View>
					)}

					<View className="flex-row justify-between">
						<Text className="text-sm text-neutral-600">Kargo</Text>
						<Text className="text-sm font-semibold text-neutral-900">
							{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
						</Text>
					</View>

					<View className="flex-row justify-between items-baseline pt-3 border-t border-neutral-200 mt-1">
						<Text className="text-base font-bold text-neutral-900">Toplam</Text>
						<Text className="text-xl font-bold text-dr-red">
							{formatPrice(total)}
						</Text>
					</View>
				</View>

				{/* Siparişi İptal Et Butonu (Koşullu) */}
				{order.canBeCancelled && (
					<Button
						onPress={handleCancelPress}
						disabled={cancelOrderMutation.isPending}
						className="h-12 justify-center bg-red-50 border border-red-200"
					>
						<Text className="text-dr-red font-bold text-sm">
							{cancelOrderMutation.isPending ? "İptal Ediliyor..." : "Siparişi İptal Et"}
						</Text>
					</Button>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
