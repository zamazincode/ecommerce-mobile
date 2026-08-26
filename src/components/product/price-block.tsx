import { discountPercent, formatPrice } from "@/lib/utils/format";
import { Text, View } from "react-native";

type Props = {
	price: number | string;
	effectivePrice: number | string;
};

export function PriceBlock({ price, effectivePrice }: Props) {
	const discount = discountPercent(price, effectivePrice);
	const hasDiscount = discount !== null;

	return (
		<View className="my-3">
			<View className="flex-row items-baseline gap-3">
				<Text className="text-2xl font-bold text-dr-red">
					{formatPrice(effectivePrice)}
				</Text>
				{hasDiscount && (
					<Text className="text-base text-neutral-400 line-through">
						{formatPrice(price)}
					</Text>
				)}
				{hasDiscount && (
					<View className="bg-dr-red px-2 py-0.5 rounded-md">
						<Text className="text-white text-xs font-bold">
							%{discount} İndirim
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}

export default PriceBlock;
