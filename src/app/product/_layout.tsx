import { Stack } from "expo-router";

export default function ProductLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Ürünler",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="[slug]"
				options={{
					title: "",
					headerShown: true,
					headerBackTitle: "Geri",
				}}
			/>
		</Stack>
	);
}
