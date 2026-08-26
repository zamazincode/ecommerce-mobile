import { BANNERS } from "@/constants/data";
import { Link } from "expo-router";
import { useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Pressable,
	View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BannerCarousel() {
	const [activeIndex, setActiveIndex] = useState(0);

	// Kaydırma bittiğinde aktif slide indeksini hesaplar
	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollOffset = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollOffset / SCREEN_WIDTH);
		setActiveIndex(index);
	};

	return (
		<View className="py-2">
			<FlatList
				data={BANNERS}
				keyExtractor={(item) => item.id}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				snapToInterval={SCREEN_WIDTH}
				decelerationRate="fast"
				onScroll={handleScroll}
				scrollEventThrottle={16}
				renderItem={({ item }) => (
					<View
						style={{ width: SCREEN_WIDTH }}
						className="items-center px-4"
					>
						{item.link ? (
							<Link href={item.link as any} asChild>
								<Pressable className="w-full h-44 rounded-2xl overflow-hidden active:opacity-90">
									<Image
										source={{ uri: item.image }}
										className="w-full h-full bg-neutral-200"
										resizeMode="cover"
									/>
								</Pressable>
							</Link>
						) : (
							<View className="w-full h-44 rounded-2xl overflow-hidden">
								<Image
									source={{ uri: item.image }}
									className="w-full h-full bg-neutral-200"
									resizeMode="cover"
								/>
							</View>
						)}
					</View>
				)}
			/>

			{/* Pagination Dots */}
			<View className="flex-row justify-center items-center gap-1.5 mt-3">
				{BANNERS.map((_, index) => (
					<View
						key={index}
						className={`h-2 rounded-full transition-all ${
							activeIndex === index
								? "w-6 bg-dr-red"
								: "w-2 bg-neutral-300"
						}`}
					/>
				))}
			</View>
		</View>
	);
}
