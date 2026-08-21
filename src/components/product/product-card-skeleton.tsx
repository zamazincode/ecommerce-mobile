import { Skeleton } from "@/components/ui/skeleton";
import { View } from "react-native";

export function ProductCardSkeleton({ width }: { width?: number }) {
	return (
		<View style={width ? { width } : undefined}>
			<Skeleton className="aspect-[3/4] rounded-xl" />
			<Skeleton className="h-3 mt-2 w-full" />
			<Skeleton className="h-3 mt-1.5 w-2/3" />
			<Skeleton className="h-4 mt-2 w-1/2" />
		</View>
	);
}
