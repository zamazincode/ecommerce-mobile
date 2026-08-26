import Button from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { usePaymentStatus } from "@/hooks/use-payment";
import { formatPrice, toNumber } from "@/lib/utils/format";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutResultScreen() {
	const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
	const { data, isLoading, isError, refetch } = usePaymentStatus(orderNumber);

	if (isLoading) {
		return <LoadingState label="Ödeme durumu doğrulanıyor..." />;
	}

	if (isError) {
		return (
			<SafeAreaView className="flex-1 bg-white p-4 justify-center" edges={["top"]}>
				<ErrorState
					message="Ödeme durumu sorgulanamadı."
					onRetry={refetch}
				/>
			</SafeAreaView>
		);
	}

	// 0: Pending, 1: Paid/Success, 2: Failed/Cancelled
	const isSuccess = data?.orderStatus === 1 || data?.paymentStatus === 1;
	const isPending = data?.orderStatus === 0 && data?.paymentStatus === null;

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<Stack.Screen
				options={{
					title: "Sipariş Sonucu",
					headerShown: true,
					headerLeft: () => null, // Geri butonunu kaldır
				}}
			/>

			<View className="flex-1 items-center justify-center px-6 py-8">
				{isSuccess ? (
					<>
						<View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-5 border-2 border-emerald-500">
							<Ionicons name="checkmark" size={44} color="#059669" />
						</View>

						<Text className="text-2xl font-bold text-neutral-900 text-center">
							Siparişiniz Alındı!
						</Text>

						<Text className="text-sm text-neutral-500 text-center mt-2 leading-5">
							Ödemeniz başarıyla tamamlandı ve siparişiniz hazırlanıyor.
						</Text>

						<View className="w-full bg-neutral-50 p-4 rounded-2xl border border-neutral-100 my-6 gap-2">
							<View className="flex-row justify-between">
								<Text className="text-xs text-neutral-500 font-medium">
									Sipariş Numarası
								</Text>
								<Text className="text-xs font-bold text-neutral-900">
									#{orderNumber}
								</Text>
							</View>
							{data?.amount !== undefined && (
								<View className="flex-row justify-between pt-2 border-t border-neutral-200/60">
									<Text className="text-xs text-neutral-500 font-medium">
										Ödenen Tutar
									</Text>
									<Text className="text-xs font-bold text-dr-red">
										{formatPrice(toNumber(data.amount))}
									</Text>
								</View>
							)}
						</View>

						<View className="w-full gap-3">
							<Button
								onPress={() => router.replace(`/order/${orderNumber}` as any)}
								className="h-12 justify-center bg-neutral-900"
							>
								<Text className="text-white font-bold text-base">
									Sipariş Detayına Git
								</Text>
							</Button>

							<Button
								onPress={() => router.replace("/")}
								className="h-12 justify-center bg-neutral-100"
							>
								<Text className="text-neutral-800 font-bold text-base">
									Alışverişe Devam Et
								</Text>
							</Button>
						</View>
					</>
				) : isPending ? (
					<>
						<View className="w-20 h-20 rounded-full bg-amber-50 items-center justify-center mb-5 border-2 border-amber-500">
							<Feather name="clock" size={36} color="#d97706" />
						</View>

						<Text className="text-2xl font-bold text-neutral-900 text-center">
							Ödemeniz İşleniyor
						</Text>

						<Text className="text-sm text-neutral-500 text-center mt-2 leading-5 mb-6">
							Bankanızdan onay bekleniyor. Siparişinizin durumunu siparişlerim sayfasından takip edebilirsiniz.
						</Text>

						<Button
							onPress={() => router.replace("/order" as any)}
							className="w-full h-12 justify-center bg-neutral-900"
						>
							<Text className="text-white font-bold text-base">
								Siparişlerime Git
							</Text>
						</Button>
					</>
				) : (
					<>
						<View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-5 border-2 border-dr-red">
							<Ionicons name="close" size={44} color="#E30613" />
						</View>

						<Text className="text-2xl font-bold text-neutral-900 text-center">
							Ödeme Başarısız Oldu
						</Text>

						<Text className="text-sm text-neutral-500 text-center mt-2 leading-5 mb-6">
							Ödeme işlemi tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
						</Text>

						<View className="w-full gap-3">
							<Button
								onPress={() =>
									router.replace(`/checkout/payment?orderNumber=${orderNumber}` as any)
								}
								className="h-12 justify-center bg-dr-red"
							>
								<Text className="text-white font-bold text-base">
									Tekrar Dene
								</Text>
							</Button>

							<Button
								onPress={() => router.replace("/(tabs)/cart" as any)}
								className="h-12 justify-center bg-neutral-100"
							>
								<Text className="text-neutral-800 font-bold text-base">
									Sepete Dön
								</Text>
							</Button>
						</View>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}
