import Button from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { ActivityIndicator, Text, View } from "react-native";

export function LoadingState({ label = "Yükleniyor..." }: { label?: string }) {
	return (
		<View className="flex-1 items-center justify-center py-12">
			<ActivityIndicator size="large" color={colors.primary.DEFAULT} />
			<Text className="mt-3 text-neutral-500 text-sm">{label}</Text>
		</View>
	);
}

export function ErrorState({
	message = "Bir seyler ters gitti.",
	onRetry,
}: {
	message?: string;
	onRetry?: () => void;
}) {
	return (
		<View className="flex-1 items-center justify-center px-8 py-12">
			<Text className="text-neutral-800 text-base font-semibold text-center">
				{message}
			</Text>
			<Text className="text-neutral-500 text-sm text-center mt-1">
				Lutfen tekrar deneyin.
			</Text>
			{onRetry ? (
				<Button onPress={onRetry} className="mt-4 px-6">
					<Text className="text-white font-semibold">
						Tekrar dene
					</Text>
				</Button>
			) : null}
		</View>
	);
}

export function EmptyState({
	title = "Sonuc bulunamadi",
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<View className="flex-1 items-center justify-center px-8 py-12">
			<Text className="text-neutral-800 text-base font-semibold">
				{title}
			</Text>
			{description ? (
				<Text className="text-neutral-500 text-sm text-center mt-1">
					{description}
				</Text>
			) : null}
		</View>
	);
}

/** FlatList'in ListFooterComponent'i icin: sonsuz kaydirmada alt spinner */
export function ListFooter({ visible }: { visible: boolean }) {
	if (!visible) return null;
	return (
		<View className="py-6">
			<ActivityIndicator color={colors.primary.DEFAULT} />
		</View>
	);
}
