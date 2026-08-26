import { toNumber } from "@/lib/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
	inStock: boolean;
	stock: number | string;
};

export function StockBadge({ inStock, stock }: Props) {
	const stockCount = toNumber(stock);

	if (!inStock || stockCount <= 0) {
		return (
			<View className="flex-row items-center gap-1.5 self-start bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
				<Ionicons name="close-circle" size={14} color="#6b7280" />
				<Text className="text-xs font-semibold text-neutral-600">Tükendi</Text>
			</View>
		);
	}

	if (stockCount <= 5) {
		return (
			<View className="flex-row items-center gap-1.5 self-start bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
				<Ionicons name="alert-circle" size={14} color="#d97706" />
				<Text className="text-xs font-semibold text-amber-700">
					Son {stockCount} ürün kaldı!
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-row items-center gap-1.5 self-start bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
			<Ionicons name="checkmark-circle" size={14} color="#059669" />
			<Text className="text-xs font-semibold text-emerald-700">Stokta Var</Text>
		</View>
	);
}

export default StockBadge;
