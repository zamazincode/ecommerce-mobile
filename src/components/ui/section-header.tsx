import { type Href, Link } from "expo-router";
import { Text, View } from "react-native";

export function SectionHeader({ title, href }: { title: string; href?: Href }) {
	return (
		<View className="flex-row items-center justify-between px-4 mt-6 mb-3">
			<Text className="text-lg font-bold text-neutral-900">{title}</Text>
			{href && (
				<Link href={href} className="text-sm text-dr-red font-semibold">
					Tümü
				</Link>
			)}
		</View>
	);
}
