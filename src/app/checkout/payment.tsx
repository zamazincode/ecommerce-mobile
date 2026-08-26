import Button from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { usePaymentInit } from "@/hooks/use-payment";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let WebViewComponent: any = null;
try {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const webviewModule = require("react-native-webview");
	WebViewComponent = webviewModule.WebView;
} catch {
	// Expo Go'da WebView modülü yoksa fallback görünümü sun
}

export default function PaymentScreen() {
	const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
	const { data, isLoading, isError, refetch } = usePaymentInit(orderNumber);

	if (isLoading) {
		return <LoadingState label="Güvenli ödeme sayfası hazırlanıyor..." />;
	}

	if (isError || !data || !data.checkoutContent) {
		return (
			<SafeAreaView className="flex-1 bg-white p-4 justify-center" edges={["top"]}>
				<ErrorState
					message="Ödeme sayfası yüklenemedi. Lütfen tekrar deneyin."
					onRetry={refetch}
				/>
			</SafeAreaView>
		);
	}

	const handleNavigationStateChange = (navState: { url: string }) => {
		const url = navState.url.toLowerCase();
		if (
			url.includes("payment-success") ||
			url.includes("payment-fail") ||
			url.includes("callback") ||
			url.includes("result")
		) {
			router.replace(`/checkout/result?orderNumber=${orderNumber}` as any);
		}
	};

	// WebView native modülü mevcut değilse (örn. Expo Go simülasyonu)
	if (!WebViewComponent) {
		return (
			<SafeAreaView className="flex-1 bg-neutral-50 p-6 justify-center" edges={["top", "bottom"]}>
				<Stack.Screen
					options={{
						title: "Güvenli Ödeme",
						headerShown: true,
						headerBackTitle: "Sipariş",
					}}
				/>

				<View className="bg-white p-6 rounded-3xl border border-neutral-100 items-center shadow-sm">
					<View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-4 border border-blue-100">
						<Feather name="credit-card" size={28} color="#2563eb" />
					</View>

					<Text className="text-xl font-bold text-neutral-900 text-center">
						3D Secure Ödeme Sayfası
					</Text>

					<Text className="text-sm text-neutral-500 text-center mt-2 leading-5 mb-6">
						Sipariş (#{orderNumber}) için ödeme oturumu başarıyla oluşturuldu.
					</Text>

					<View className="w-full bg-neutral-50 p-4 rounded-2xl border border-neutral-200 mb-6">
						<View className="flex-row items-center gap-2 mb-1">
							<Ionicons name="shield-checkmark" size={18} color="#059669" />
							<Text className="text-xs font-bold text-emerald-800">
								256-Bit SSL Güvenli Bağlantı
							</Text>
						</View>
						<Text className="text-xs text-neutral-500 mt-1">
							Ödeme formunuz hazırlandı.
						</Text>
					</View>

					<View className="w-full gap-3">
						<Button
							onPress={() =>
								router.replace(`/checkout/result?orderNumber=${orderNumber}` as any)
							}
							className="h-12 justify-center bg-dr-red"
						>
							<Text className="text-white font-bold text-base">
								Ödemeyi Tamamla ve Sonuca Git →
							</Text>
						</Button>

						<Button
							onPress={() => router.back()}
							className="h-12 justify-center bg-neutral-100"
						>
							<Text className="text-neutral-800 font-bold text-base">
								Geri Dön
							</Text>
						</Button>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<Stack.Screen
				options={{
					title: "Güvenli Ödeme",
					headerShown: true,
					headerBackTitle: "Sipariş",
				}}
			/>

			<WebViewComponent
				originWhitelist={["*"]}
				source={{ html: data.checkoutContent }}
				onNavigationStateChange={handleNavigationStateChange}
				startInLoadingState
				renderLoading={() => (
					<View className="absolute inset-0 items-center justify-center bg-white">
						<ActivityIndicator size="large" color="#E30613" />
					</View>
				)}
				className="flex-1"
			/>
		</SafeAreaView>
	);
}
