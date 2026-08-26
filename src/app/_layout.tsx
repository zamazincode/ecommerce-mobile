import {
	registerForPushNotificationsAsync,
	setupNotificationListeners,
} from "@/lib/notifications";
import { QueryProvider } from "@/providers/QueryProvider";
import { useAuthStore } from "@/stores/auth-store";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
	const bootstrap = useAuthStore((s) => s.bootstrap);
	const isHydrating = useAuthStore((s) => s.isHydrating);

	useEffect(() => {
		bootstrap();
		registerForPushNotificationsAsync();

		const cleanup = setupNotificationListeners((response) => {
			const data = response.notification.request.content.data as any;
			if (data?.url) {
				router.push(data.url);
			} else if (data?.orderNumber) {
				router.push(`/order/${data.orderNumber}` as any);
			} else if (data?.productSlug) {
				router.push(`/product/${data.productSlug}` as any);
			}
		});

		return cleanup;
	}, [bootstrap]);

	if (isHydrating) {
		return null;
	}

	return (
		<QueryProvider>
			<SafeAreaProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="product" />
					<Stack.Screen name="category" />
					<Stack.Screen name="search" />
					<Stack.Screen name="checkout" />
					<Stack.Screen name="order" />
					<Stack.Screen name="profile" />
				</Stack>
			</SafeAreaProvider>
		</QueryProvider>
	);
}
