import Button from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
	const user = useAuthStore((s) => s.user);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const signOut = useAuthStore((s) => s.signOut);

	const handleSignOut = () => {
		Alert.alert("Çıkış Yap", "Hesabınızdan çıkış yapmak istediğinize emin misiniz?", [
			{ text: "Vazgeç", style: "cancel" },
			{
				text: "Çıkış Yap",
				style: "destructive",
				onPress: async () => {
					await signOut();
				},
			},
		]);
	};

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<View className="px-5 py-3.5 bg-white border-b border-neutral-100">
				<Text className="text-xl font-bold text-neutral-900">Hesabım</Text>
			</View>

			<ScrollView
				contentContainerClassName="p-4 pb-20 gap-4"
				showsVerticalScrollIndicator={false}
			>
				{!isAuthenticated ? (
					/* Giriş Yapılmamış Durum */
					<View className="bg-white p-6 rounded-2xl border border-neutral-100 items-center text-center">
						<View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
							<Ionicons name="person-outline" size={32} color="#E30613" />
						</View>
						<Text className="text-lg font-bold text-neutral-900 text-center">
							D&R Dünyasına Hoş Geldiniz
						</Text>
						<Text className="text-xs text-neutral-500 text-center mt-1.5 leading-5 mb-6">
							Siparişlerinizi takip etmek, favorilerinizi kaydetmek ve özel fırsatlardan yararlanmak için giriş yapın.
						</Text>

						<View className="w-full gap-3">
							<Button
								onPress={() => router.push("/(auth)/login" as any)}
								className="h-12 justify-center bg-dr-red"
							>
								<Text className="text-white font-bold text-base">Giriş Yap</Text>
							</Button>

							<Button
								onPress={() => router.push("/(auth)/register" as any)}
								className="h-12 justify-center bg-neutral-100"
							>
								<Text className="text-neutral-800 font-bold text-base">
									Üye Ol
								</Text>
							</Button>
						</View>
					</View>
				) : (
					/* Giriş Yapılmış Durum */
					<>
						{/* Profil Kartı */}
						<View className="bg-white p-5 rounded-2xl border border-neutral-100 flex-row items-center gap-4">
							<View className="w-14 h-14 rounded-full bg-dr-navy items-center justify-center">
								<Text className="text-lg font-bold text-white uppercase">
									{user?.firstName?.[0] ?? "U"}
									{user?.lastName?.[0] ?? ""}
								</Text>
							</View>
							<View className="flex-1">
								<Text className="text-base font-bold text-neutral-900">
									{user?.firstName} {user?.lastName}
								</Text>
								<Text className="text-xs text-neutral-500 mt-0.5">
									{user?.email}
								</Text>
							</View>
						</View>

						{/* Menü Seçenekleri */}
						<View className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
							<MenuItem
								icon={<Feather name="package" size={20} color="#002B49" />}
								title="Siparişlerim"
								subtitle="Tüm siparişlerinizi ve kargo durumunu görün"
								onPress={() => router.push("/order" as any)}
							/>

							<MenuItem
								icon={<Ionicons name="location-outline" size={22} color="#002B49" />}
								title="Kayıtlı Adreslerim"
								subtitle="Teslimat adreslerinizi düzenleyin veya ekleyin"
								onPress={() => router.push("/profile/addresses" as any)}
							/>

							<MenuItem
								icon={<Ionicons name="heart-outline" size={22} color="#002B49" />}
								title="Favorilerim"
								subtitle="Beğendiğiniz tüm ürünler"
								onPress={() => router.push("/(tabs)/favorites" as any)}
							/>
						</View>

						{/* Çıkış Yap Butonu */}
						<Pressable
							onPress={handleSignOut}
							className="bg-white p-4 rounded-2xl border border-red-100 flex-row items-center justify-center gap-2 active:bg-red-50"
						>
							<Feather name="log-out" size={18} color="#dc2626" />
							<Text className="text-sm font-bold text-red-600">Çıkış Yap</Text>
						</Pressable>
					</>
				)}

				{/* Genel Bilgilendirme Bağlantıları */}
				<View className="bg-white rounded-2xl border border-neutral-100 overflow-hidden mt-2">
					<View className="p-4 border-b border-neutral-100 flex-row items-center justify-between">
						<Text className="text-sm font-medium text-neutral-700">
							Yardım & Destek
						</Text>
						<Ionicons name="chevron-forward" size={16} color="#9ca3af" />
					</View>
					<View className="p-4 border-b border-neutral-100 flex-row items-center justify-between">
						<Text className="text-sm font-medium text-neutral-700">
							Gizlilik & Güvenlik Politikası
						</Text>
						<Ionicons name="chevron-forward" size={16} color="#9ca3af" />
					</View>
					<View className="p-4 flex-row items-center justify-between">
						<Text className="text-sm font-medium text-neutral-700">
							Uygulama Versiyonu
						</Text>
						<Text className="text-xs text-neutral-400 font-semibold">1.0.0</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

function MenuItem({
	icon,
	title,
	subtitle,
	onPress,
}: {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	onPress: () => void;
}) {
	return (
		<Pressable
			onPress={onPress}
			className="p-4 flex-row items-center gap-3.5 border-b border-neutral-100 active:bg-neutral-50"
		>
			<View className="w-9 h-9 rounded-xl bg-neutral-50 items-center justify-center">
				{icon}
			</View>
			<View className="flex-1">
				<Text className="text-sm font-bold text-neutral-900">{title}</Text>
				<Text className="text-xs text-neutral-500 mt-0.5">{subtitle}</Text>
			</View>
			<Ionicons name="chevron-forward" size={18} color="#9ca3af" />
		</Pressable>
	);
}
