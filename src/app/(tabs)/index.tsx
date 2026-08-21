import BannerCarousel from "@/components/layout/banner-carousel";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import ProductRow from "@/components/product/product-row";
import SearchBar from "@/components/search-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/states";
import { useHome } from "@/hooks/use-home";
import { router } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const { data, isLoading, isError, refetch, isRefetching } = useHome();

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<SearchBar onSearch={() => router.push("/search")} />

			{isError ? (
				<ErrorState onRetry={refetch} />
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							onRefresh={refetch}
						/>
					}
				>
					<BannerCarousel />

					{isLoading ? (
						<HomeSkeleton />
					) : (
						<>
							<SectionHeader
								title="Cok Satanlar"
								// href="/product?sort=bestseller"
							/>
							<ProductRow products={data?.bestsellers ?? []} />

							<SectionHeader title="Yeni Gelenler" />
							<ProductRow products={data?.newArrivals ?? []} />

							<SectionHeader title="Indirimdekiler" />
							<ProductRow products={data?.discounted ?? []} />
						</>
					)}

					<View className="h-8" />
				</ScrollView>
			)}
		</SafeAreaView>
	);
}

function HomeSkeleton() {
	return (
		<View className="flex-row gap-3 px-4 mt-6">
			<Skeleton className="h-44 rounded-xl" />
			{[0, 1, 2].map((i) => (
				<ProductCardSkeleton key={i} width={140} />
			))}
		</View>
	);
}
