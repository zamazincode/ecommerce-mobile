import SearchBar from "@/components/search-bar";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useCategories } from "@/hooks/use-categories";
import type { CategoryTree } from "@/types/dtos";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryScreen() {
	const { data, isLoading, isError, refetch, isRefetching } = useCategories();
	const [openId, setOpenId] = useState<number | string | null>(null);

	if (isLoading) return <LoadingState label="Kategoriler yükleniyor..." />;
	if (isError) return <ErrorState message="Kategoriler alınamadı." onRetry={refetch} />;

	const toggleAccordion = (id: number | string) => {
		setOpenId((prev) => (prev === id ? null : id));
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top"]}>
			<SearchBar onSearch={() => router.push("/search")} />

			<FlatList
				data={data ?? []}
				keyExtractor={(c) => String(c.id)}
				contentContainerClassName="py-2"
				refreshControl={
					<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
				}
				renderItem={({ item }) => (
					<CategoryAccordionItem
						category={item}
						isOpen={openId === item.id}
						onToggle={() => toggleAccordion(item.id)}
					/>
				)}
			/>
		</SafeAreaView>
	);
}

function CategoryAccordionItem({
	category,
	isOpen,
	onToggle,
}: {
	category: CategoryTree;
	isOpen: boolean;
	onToggle: () => void;
}) {
	const hasChildren = category.children && category.children.length > 0;

	const handlePress = () => {
		if (hasChildren) {
			onToggle();
		} else {
			router.push(`/category/${category.slug}`);
		}
	};

	return (
		<View className="border-b border-neutral-100">
			<Pressable
				onPress={handlePress}
				className="flex-row items-center justify-between px-5 py-4 active:bg-neutral-50"
			>
				<View className="flex-row items-center gap-3">
					<View className="w-8 h-8 rounded-lg bg-neutral-100 items-center justify-center">
						<Ionicons name="grid-outline" size={16} color="#6b7280" />
					</View>
					<Text className="text-base font-semibold text-neutral-900">
						{category.name}
					</Text>
				</View>

				{hasChildren ? (
					<Ionicons
						name={isOpen ? "chevron-up" : "chevron-forward"}
						size={18}
						color="#9ca3af"
					/>
				) : (
					<Ionicons name="chevron-forward" size={18} color="#d1d5db" />
				)}
			</Pressable>

			{hasChildren && isOpen && (
				<View className="bg-neutral-50 px-5 py-2">
					<Pressable
						onPress={() => router.push(`/category/${category.slug}`)}
						className="py-3 px-3 flex-row items-center justify-between border-b border-neutral-200/60"
					>
						<Text className="text-sm font-medium text-dr-red">
							Tüm {category.name} Ürünleri
						</Text>
						<Ionicons name="arrow-forward" size={16} color="#E30613" />
					</Pressable>

					{category.children.map((child) => (
						<Pressable
							key={String(child.id)}
							onPress={() => router.push(`/category/${child.slug}`)}
							className="py-3 px-3 flex-row items-center justify-between active:opacity-70"
						>
							<Text className="text-sm text-neutral-700">{child.name}</Text>
							<Ionicons name="chevron-forward" size={14} color="#9ca3af" />
						</Pressable>
					))}
				</View>
			)}
		</View>
	);
}
