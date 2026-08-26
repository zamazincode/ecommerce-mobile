import { useFavoriteToggle } from "@/hooks/use-favorite-toggle";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export function FavoriteButton({
	productId,
}: {
	productId: number | string;
}) {
	const { isFavorite, toggle, isPending, isAuthenticated } =
		useFavoriteToggle(productId);

	const handlePress = () => {
		if (!isAuthenticated) {
			router.push("/(auth)/login" as any);
			return;
		}
		toggle();
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={isPending}
			hitSlop={8}
			className="p-2.5 rounded-full bg-neutral-100 items-center justify-center active:opacity-70"
		>
			<Ionicons
				name={isFavorite ? "heart" : "heart-outline"}
				size={22}
				color={isFavorite ? "#E30613" : "#374151"}
			/>
		</Pressable>
	);
}

export default FavoriteButton;
