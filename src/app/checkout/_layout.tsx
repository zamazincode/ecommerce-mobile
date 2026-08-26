import { Stack } from "expo-router";

export default function CheckoutLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackTitle: "Geri",
				headerTintColor: "#E30613",
				headerTitleStyle: { color: "#111827", fontWeight: "bold" },
			}}
		/>
	);
}
