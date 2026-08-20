import { useLocalSearchParams } from "expo-router";

export default function ProductDetailScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	return null;
}
