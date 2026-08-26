import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

let Notifications: typeof import("expo-notifications") | null = null;
try {
	// Expo Go'da veya native modülün bulunmadığı ortamlarda çökmemesi için korumalı yükle
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	Notifications = require("expo-notifications");
	if (Notifications?.setNotificationHandler) {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldPlaySound: true,
				shouldSetBadge: true,
				shouldShowAlert: true,
				shouldShowBanner: true,
				shouldShowList: true,
			}),
		});
	}
} catch {
	// Native modül yoksa sessizce geç
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
	if (!Notifications) return null;

	try {
		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "Varsayılan",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#E30613",
			});
		}

		if (!Device.isDevice) {
			return null;
		}

		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			return null;
		}

		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId;

		const tokenData = await Notifications.getExpoPushTokenAsync(
			projectId ? { projectId } : undefined,
		);
		return tokenData.data;
	} catch {
		return null;
	}
}

export function setupNotificationListeners(
	onResponse: (response: any) => void,
) {
	if (!Notifications?.addNotificationResponseReceivedListener) {
		return () => {};
	}

	try {
		const responseSubscription =
			Notifications.addNotificationResponseReceivedListener(onResponse);

		return () => {
			responseSubscription.remove();
		};
	} catch {
		return () => {};
	}
}
