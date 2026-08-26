import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
	quantity: number;
	maxQuantity?: number;
	onChange: (newQuantity: number) => void;
	disabled?: boolean;
};

export function QuantitySelector({
	quantity,
	maxQuantity = 99,
	onChange,
	disabled = false,
}: Props) {
	return (
		<View className="flex-row items-center bg-neutral-100 rounded-lg p-0.5 border border-neutral-200/80">
			<Pressable
				onPress={() => onChange(Math.max(0, quantity - 1))}
				disabled={disabled}
				className="w-7 h-7 items-center justify-center rounded-md active:bg-neutral-200"
				hitSlop={4}
			>
				<Feather
					name={quantity <= 1 ? "trash-2" : "minus"}
					size={14}
					color={quantity <= 1 ? "#E30613" : "#374151"}
				/>
			</Pressable>

			<Text className="w-8 text-center text-sm font-bold text-neutral-900">
				{quantity}
			</Text>

			<Pressable
				onPress={() => onChange(Math.min(maxQuantity, quantity + 1))}
				disabled={disabled || quantity >= maxQuantity}
				className="w-7 h-7 items-center justify-center rounded-md active:bg-neutral-200"
				hitSlop={4}
			>
				<Feather
					name="plus"
					size={14}
					color={quantity >= maxQuantity ? "#9ca3af" : "#374151"}
				/>
			</Pressable>
		</View>
	);
}

export default QuantitySelector;
