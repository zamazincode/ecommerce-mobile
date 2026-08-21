import { View } from "react-native";

export function Skeleton({ className = "" }: { className?: string }) {
	return <View className={`bg-neutral-200 rounded-lg ${className}`} />;
}
