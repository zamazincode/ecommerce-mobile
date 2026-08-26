import { useAddToCart } from "@/hooks/use-add-to-cart";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
	productId: number | string;
	disabled?: boolean;
};

export function AddToCartButton({ productId, disabled = false }: Props) {
	const { mutate, isPending } = useAddToCart();

	const handlePress = () => {
		if (disabled || isPending) return;
		mutate({ productId, quantity: 1 });
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={disabled || isPending}
			className={`flex-row items-center justify-center gap-2 py-3.5 px-6 rounded-xl ${
				disabled
					? "bg-neutral-300"
					: "bg-dr-red active:opacity-90"
			}`}
		>
			{isPending ? (
				<ActivityIndicator size="small" color="#ffffff" />
			) : (
				<>
					<Ionicons name="cart" size={20} color="#ffffff" />
					<Text className="text-white font-bold text-base">
						{disabled ? "Tükendi" : "Sepete Ekle"}
					</Text>
				</>
			)}
		</Pressable>
	);
}

export default AddToCartButton;
