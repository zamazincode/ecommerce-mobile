import Button from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-create-order";
import { getErrorMessage } from "@/lib/api/error-mapper";
import { newIdempotencyKey } from "@/lib/api/order";
import { formatPrice, toNumber } from "@/lib/utils/format";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutReviewScreen() {
	const params = useLocalSearchParams<{ addressId?: string }>();
	const { data: cart, isLoading: isCartLoading } = useCart();
	const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
	const createOrderMutation = useCreateOrder();

	const [note, setNote] = useState("");
	const [formError, setFormError] = useState<string | null>(null);

	// Sipariş girişimi boyunca aynı Idempotency-Key korunur
	const idempotencyKey = useRef(newIdempotencyKey());

	if (isCartLoading || isAddressesLoading) {
		return <LoadingState label="Sipariş özeti hazırlanıyor..." />;
	}

	const selectedAddress = addresses?.find(
		(a) => String(a.id) === String(params.addressId),
	);

	if (!selectedAddress) {
		return (
			<SafeAreaView className="flex-1 bg-white p-4 justify-center" edges={["top"]}>
				<ErrorState
					message="Teslimat adresi seçilmedi."
					onRetry={() => router.back()}
				/>
			</SafeAreaView>
		);
	}

	const items = cart?.items ?? [];
	const subTotal = toNumber(cart?.subTotal);
	const discountAmount = toNumber(cart?.discountAmount);
	const shippingCost = toNumber(cart?.shippingCost);
	const total = toNumber(cart?.total);

	const handleCompleteOrder = () => {
		setFormError(null);
		createOrderMutation.mutate(
			{
				payload: {
					addressId: selectedAddress.id,
					note: note.trim() || null,
					expectedTotal: total,
				},
				idempotencyKey: idempotencyKey.current,
			},
			{
				onSuccess: (order) => {
					router.replace(`/checkout/payment?orderNumber=${order.orderNumber}` as any);
				},
				onError: (err: any) => {
					const msg = getErrorMessage(err);
					setFormError(msg);
					// Kullanıcı yeni bir deneme başlatmak isterse anahtarı yenile
					idempotencyKey.current = newIdempotencyKey();

					if (err?.status === 409) {
						Alert.alert(
							"Sipariş Güncellenemedi",
							"Sepetinizdeki ürünlerin fiyatı veya stok durumu değişmiş olabilir. Lütfen sepetinizi kontrol edin.",
							[
								{
									text: "Sepete Dön",
									onPress: () => router.replace("/(tabs)/cart" as any),
								},
							],
						);
					}
				},
			},
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top", "bottom"]}>
			<Stack.Screen
				options={{
					title: "Sipariş Özeti",
					headerShown: true,
					headerBackTitle: "Adres",
				}}
			/>

			<ScrollView
				contentContainerClassName="p-4 pb-32"
				showsVerticalScrollIndicator={false}
			>
				{/* 1. Teslimat Adresi Özeti */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-4">
					<View className="flex-row items-center justify-between mb-2">
						<View className="flex-row items-center gap-2">
							<Ionicons name="location-outline" size={20} color="#E30613" />
							<Text className="text-sm font-bold text-neutral-900">
								Teslimat Adresi
							</Text>
						</View>
						<Pressable onPress={() => router.back()} hitSlop={8}>
							<Text className="text-xs font-bold text-dr-red">Değiştir</Text>
						</Pressable>
					</View>

					<Text className="text-sm font-semibold text-neutral-800">
						{selectedAddress.title} • {selectedAddress.fullName}
					</Text>
					<Text className="text-xs text-neutral-500 mt-1 leading-5">
						{selectedAddress.fullAddress}
					</Text>
					<Text className="text-xs font-medium text-neutral-700 mt-0.5">
						{selectedAddress.district} / {selectedAddress.city} • {selectedAddress.phone}
					</Text>
				</View>

				{/* 2. Sepetteki Ürünler Listesi */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-4">
					<Text className="text-sm font-bold text-neutral-900 mb-3">
						Sipariş Edilecek Ürünler ({items.length})
					</Text>

					<View className="gap-3">
						{items.map((item) => (
							<View
								key={String(item.productId)}
								className="flex-row items-center gap-3 pb-3 border-b border-neutral-100"
							>
								{item.imageUrl ? (
									<Image
										source={item.imageUrl}
										contentFit="contain"
										style={{ width: 44, height: 58, borderRadius: 6 }}
									/>
								) : (
									<View className="w-11 h-14 rounded-md bg-neutral-100 items-center justify-center">
										<Feather name="book" size={18} color="#9ca3af" />
									</View>
								)}
								<View className="flex-1">
									<Text
										numberOfLines={1}
										className="text-sm font-medium text-neutral-900"
									>
										{item.name}
									</Text>
									<Text className="text-xs text-neutral-500 mt-0.5">
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

				{/* 3. Sipariş Notu (Opsiyonel) */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-4">
					<Text className="text-sm font-bold text-neutral-900 mb-2">
						Sipariş Notu (Opsiyonel)
					</Text>
					<TextInput
						value={note}
						onChangeText={setNote}
						placeholder="Kurye veya teslimat için bir not ekleyin..."
						placeholderTextColor="#9ca3af"
						className="h-20 p-3 rounded-xl border border-neutral-200 text-sm text-neutral-900"
						multiline
						numberOfLines={3}
						style={{ textAlignVertical: "top" }}
					/>
				</View>

				{/* 4. Fiyat Dökümü */}
				<View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-4 gap-2.5">
					<Text className="text-sm font-bold text-neutral-900 mb-1">
						Ödeme Detayları
					</Text>

					<View className="flex-row justify-between">
						<Text className="text-sm text-neutral-600">Ara Toplam</Text>
						<Text className="text-sm font-semibold text-neutral-900">
							{formatPrice(subTotal)}
						</Text>
					</View>

					{discountAmount > 0 && (
						<View className="flex-row justify-between">
							<Text className="text-sm text-emerald-600">Kupon İndirimi</Text>
							<Text className="text-sm font-semibold text-emerald-600">
								-{formatPrice(discountAmount)}
							</Text>
						</View>
					)}

					<View className="flex-row justify-between">
						<Text className="text-sm text-neutral-600">Kargo Ücreti</Text>
						<Text className="text-sm font-semibold text-neutral-900">
							{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
						</Text>
					</View>

					<View className="flex-row justify-between items-baseline pt-3 border-t border-neutral-200 mt-1">
						<Text className="text-base font-bold text-neutral-900">
							Toplam Tutar
						</Text>
						<Text className="text-xl font-bold text-dr-red">
							{formatPrice(total)}
						</Text>
					</View>
				</View>

				{formError && (
					<View className="bg-red-50 p-3.5 rounded-xl border border-red-200 mb-4">
						<Text className="text-dr-red text-sm font-medium">{formError}</Text>
					</View>
				)}
			</ScrollView>

			{/* Sabit Alt Ödeme Butonu */}
			<SafeAreaView
				edges={["bottom"]}
				className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 px-5 py-3 shadow-lg flex-row items-center justify-between"
			>
				<View>
					<Text className="text-xs text-neutral-500 font-medium">Toplam</Text>
					<Text className="text-xl font-bold text-dr-red">
						{formatPrice(total)}
					</Text>
				</View>

				<Button
					onPress={handleCompleteOrder}
					disabled={createOrderMutation.isPending}
					className="px-6 py-3.5 bg-dr-red rounded-xl"
				>
					<Text className="text-white font-bold text-base">
						{createOrderMutation.isPending
							? "Oluşturuluyor..."
							: "Ödemeye Geç →"}
					</Text>
				</Button>
			</SafeAreaView>
		</SafeAreaView>
	);
}
