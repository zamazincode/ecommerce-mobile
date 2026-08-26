import { Stack } from "expo-router";

export default function CategoryLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="[slug]"
				options={{
					title: "Kategori",
					headerShown: true,
					headerBackTitle: "Geri",
				}}
			/>
		</Stack>
	);
}
