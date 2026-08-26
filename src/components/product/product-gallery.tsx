import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
	Dimensions,
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Text,
	View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
	images?: string[];
};

export function ProductGallery({ images = [] }: Props) {
	const [activeIndex, setActiveIndex] = useState(0);
	const validImages = images.length > 0 ? images : [];

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollOffset = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollOffset / SCREEN_WIDTH);
		setActiveIndex(index);
	};

	if (validImages.length === 0) {
		return (
			<View
				style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
				className="bg-neutral-100 items-center justify-center gap-2"
			>
				<Ionicons name="image-outline" size={64} color="#9ca3af" />
				<Text className="text-xs text-neutral-400 font-medium">
					Görsel bulunamadı
				</Text>
			</View>
		);
	}

	return (
		<View className="bg-white">
			<FlatList
				data={validImages}
				keyExtractor={(_, index) => String(index)}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				renderItem={({ item, index }) => (
					<View
						style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
						className="items-center justify-center p-4 bg-neutral-50"
					>
						<Image
							source={item}
							recyclingKey={`gallery-${index}-${item}`}
							contentFit="contain"
							cachePolicy="memory-disk"
							transition={200}
							style={{ width: "100%", height: "100%" }}
						/>
					</View>
				)}
			/>

			{validImages.length > 1 && (
				<View className="flex-row justify-center items-center gap-1.5 py-3">
					{validImages.map((_, index) => (
						<View
							key={index}
							className={`h-1.5 rounded-full transition-all ${
								activeIndex === index
									? "w-5 bg-dr-red"
									: "w-1.5 bg-neutral-300"
							}`}
						/>
					))}
				</View>
			)}
		</View>
	);
}

export default ProductGallery;
