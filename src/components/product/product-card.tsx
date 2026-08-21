import { discountPercent, formatPrice } from "@/lib/utils/format";
import { Product } from "@/types/dtos";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

type ProductCardProps = {
	product: Product;
	width?: number;
};

function ProductCard({ product, width }: ProductCardProps) {
	const discount = discountPercent(product.price, product.effectivePrice);
	const hasDiscount = discount !== null;

	return (
		<Link asChild href={`/product/${product.slug}`}>
			<Pressable
				style={width ? { width: width } : undefined}
				className="active:opacity-90 relative"
			>
				<View className="rounded-xl overflow-hidden bg-neutral-100 aspect-[3/4]">
					<Image
						source={product.imageUrl}
						recyclingKey={String(product.id)}
						contentFit="cover"
						cachePolicy="memory-disk"
						transition={200}
						style={{ width: "100%", height: "100%" }}
					/>

					{hasDiscount && (
						<View className="absolute top-2 left-2 bg-dr-red px-2 py-0.5 rounded-md">
							<Text className="text-white text-xs font-bold">
								%{discount}
							</Text>
						</View>
					)}

					{!product.inStock && (
						<View className="absolute bottom-0 w-full bg-neutral-900/70 py-1">
							<Text className="text-white text-[11px] text-center">
								Tukendi
							</Text>
						</View>
					)}

					<Text
						numberOfLines={2}
						className="mt-2 text-sm text-neutral-800 leading-5"
					>
						{product.name}
					</Text>
				</View>

				<Text
					numberOfLines={2}
					className="mt-2 text-sm text-neutral-800 leading-5"
				>
					{product.name}
				</Text>

				{product.authorNames ? (
					<Text
						numberOfLines={1}
						className="text-xs text-neutral-500 mt-0.5"
					>
						{product.authorNames}
					</Text>
				) : null}

				<View className="flex-row items-baseline gap-2 mt-1">
					<Text className="text-base font-bold text-dr-red">
						{formatPrice(product.effectivePrice)}
					</Text>

					{hasDiscount && (
						<Text className="text-xs text-neutral-400 line-through">
							{formatPrice(product.price)}
						</Text>
					)}
				</View>
			</Pressable>
		</Link>
	);
}

export default memo(ProductCard);
