import { QuantitySelector } from "@/components/cart/quantity-selector";
import { formatPrice, toNumber } from "@/lib/utils/format";
import type { CartItem } from "@/types/dtos";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
	item: CartItem;
	onUpdateQuantity: (quantity: number) => void;
	onRemove: () => void;
	isPending?: boolean;
};

export function CartItemRow({
	item,
	onUpdateQuantity,
	onRemove,
	isPending = false,
}: Props) {
	const availableStock = toNumber(item.availableStock);
	const quantity = toNumber(item.quantity);

	return (
		<View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-3">
			{/* Fiyat değişti uyarısı */}
			{item.priceChanged && (
				<View className="flex-row items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg mb-3 border border-amber-200">
					<Ionicons name="alert-circle" size={16} color="#d97706" />
					<Text className="text-xs font-semibold text-amber-800">
						Ürünün birim fiyatı güncellendi.
					</Text>
				</View>
			)}

			<View className="flex-row gap-3.5">
				{/* Ürün Görseli */}
				<Link href={`/product/${item.slug}`} asChild>
					<Pressable className="active:opacity-80">
						{item.imageUrl ? (
							<Image
								source={item.imageUrl}
								contentFit="contain"
								style={{
									width: 72,
									height: 96,
									borderRadius: 10,
									backgroundColor: "#f5f5f5",
								}}
							/>
						) : (
							<View className="w-18 h-24 rounded-xl bg-neutral-100 items-center justify-center">
								<Ionicons name="image-outline" size={24} color="#9ca3af" />
							</View>
						)}
					</Pressable>
				</Link>

				{/* Bilgiler ve Kontroller */}
				<View className="flex-1 justify-between">
					<View>
						<View className="flex-row items-start justify-between gap-2">
							<Link href={`/product/${item.slug}`} asChild>
								<Pressable className="flex-1 active:opacity-80">
									<Text
										numberOfLines={2}
										className="text-sm font-semibold text-neutral-900 leading-5"
									>
										{item.name}
									</Text>
								</Pressable>
							</Link>

							<Pressable
								onPress={onRemove}
								hitSlop={8}
								disabled={isPending}
								className="p-1"
							>
								<Feather name="trash-2" size={16} color="#9ca3af" />
							</Pressable>
						</View>

						{/* Stok uyarısı */}
						{availableStock > 0 && availableStock < 5 && (
							<Text className="text-[11px] font-medium text-amber-600 mt-1">
								Stokta son {availableStock} ürün kaldı
							</Text>
						)}
					</View>

					{/* Fiyat & Adet Kontrolü */}
					<View className="flex-row items-center justify-between mt-3">
						<View>
							<Text className="text-base font-bold text-dr-red">
								{formatPrice(item.lineTotal)}
							</Text>
							{quantity > 1 && (
								<Text className="text-[11px] text-neutral-400">
									Birim: {formatPrice(item.unitPrice)}
								</Text>
							)}
						</View>

						<QuantitySelector
							quantity={quantity}
							maxQuantity={availableStock > 0 ? availableStock : 99}
							onChange={onUpdateQuantity}
							disabled={isPending}
						/>
					</View>
				</View>
			</View>
		</View>
	);
}

export default CartItemRow;
