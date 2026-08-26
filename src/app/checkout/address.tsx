import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useAddresses } from "@/hooks/use-addresses";
import { useSaveAddress } from "@/hooks/use-save-address";
import { getErrorMessage } from "@/lib/api/error-mapper";
import { addressSchema, type AddressFormValues } from "@/lib/validation/address";
import { Feather, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	FlatList,
	Modal,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutAddressScreen() {
	const { data: addresses, isLoading, isError, refetch } = useAddresses();
	const [selectedId, setSelectedId] = useState<number | string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const saveAddressMutation = useSaveAddress();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			title: "Ev",
			fullName: "",
			phone: "",
			city: "İstanbul",
			district: "Kadıköy",
			fullAddress: "",
			isDefault: false,
		},
	});

	if (isLoading) return <LoadingState label="Adresleriniz yükleniyor..." />;
	if (isError) return <ErrorState message="Adresler alınamadı." onRetry={refetch} />;

	const addressList = addresses ?? [];
	const currentSelectedId =
		selectedId ??
		addressList.find((a) => a.isDefault)?.id ??
		addressList[0]?.id ??
		null;

	const handleAddAddress = async (values: AddressFormValues) => {
		setFormError(null);
		try {
			const saved = await saveAddressMutation.mutateAsync({ data: values });
			setSelectedId(saved.id);
			setIsModalOpen(false);
			reset();
		} catch (err) {
			setFormError(getErrorMessage(err));
		}
	};

	const handleContinue = () => {
		if (!currentSelectedId) return;
		router.push(`/checkout/review?addressId=${currentSelectedId}` as any);
	};

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top", "bottom"]}>
			<Stack.Screen
				options={{
					title: "Teslimat Adresi",
					headerShown: true,
					headerBackTitle: "Sepet",
				}}
			/>

			<View className="flex-1 p-4">
				<View className="flex-row items-center justify-between mb-4">
					<Text className="text-base font-bold text-neutral-900">
						Kayıtlı Adresleriniz
					</Text>
					<Pressable
						onPress={() => setIsModalOpen(true)}
						className="flex-row items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200/60 active:opacity-80"
					>
						<Feather name="plus" size={16} color="#E30613" />
						<Text className="text-xs font-bold text-dr-red">Yeni Adres Ekle</Text>
					</Pressable>
				</View>

				{addressList.length === 0 ? (
					<View className="flex-1 justify-center">
						<EmptyState
							title="Kayıtlı Adres Yok"
							description="Siparişi tamamlamak için lütfen teslimat adresi ekleyin."
						/>
						<Button
							onPress={() => setIsModalOpen(true)}
							className="mx-8 mt-6 bg-dr-red"
						>
							<Text className="text-white font-bold text-center">
								Yeni Adres Ekle
							</Text>
						</Button>
					</View>
				) : (
					<FlatList
						data={addressList}
						keyExtractor={(item) => String(item.id)}
						showsVerticalScrollIndicator={false}
						contentContainerClassName="gap-3 pb-24"
						renderItem={({ item }) => {
							const isSelected = String(item.id) === String(currentSelectedId);
							return (
								<Pressable
									onPress={() => setSelectedId(item.id)}
									className={`p-4 rounded-2xl border bg-white ${
										isSelected
											? "border-dr-red shadow-sm bg-red-50/10"
											: "border-neutral-200"
									}`}
								>
									<View className="flex-row items-center justify-between mb-2">
										<View className="flex-row items-center gap-2">
											<Ionicons
												name={isSelected ? "radio-button-on" : "radio-button-off"}
												size={20}
												color={isSelected ? "#E30613" : "#9ca3af"}
											/>
											<Text className="text-base font-bold text-neutral-900">
												{item.title}
											</Text>
											{item.isDefault && (
												<View className="bg-neutral-100 px-2 py-0.5 rounded-md">
													<Text className="text-[10px] font-bold text-neutral-600">
														Varsayılan
													</Text>
												</View>
											)}
										</View>
									</View>

									<Text className="text-sm font-semibold text-neutral-800">
										{item.fullName} • {item.phone}
									</Text>
									<Text className="text-xs text-neutral-500 mt-1 leading-5">
										{item.fullAddress}
									</Text>
									<Text className="text-xs font-medium text-neutral-700 mt-1">
										{item.district} / {item.city}
									</Text>
								</Pressable>
							);
						}}
					/>
				)}
			</View>

			{/* Alt Devam Et Butonu */}
			{addressList.length > 0 && (
				<View className="p-4 bg-white border-t border-neutral-200 shadow-lg">
					<Button
						onPress={handleContinue}
						disabled={!currentSelectedId}
						className="h-12 justify-center bg-dr-red"
					>
						<Text className="text-white font-bold text-base">
							Sipariş Özetine Geç →
						</Text>
					</Button>
				</View>
			)}

			{/* Yeni Adres Ekleme Modalı */}
			<Modal
				visible={isModalOpen}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setIsModalOpen(false)}
			>
				<SafeAreaView className="flex-1 bg-white">
					<View className="px-5 py-4 border-b border-neutral-100 flex-row items-center justify-between">
						<Text className="text-lg font-bold text-neutral-900">
							Yeni Adres Ekle
						</Text>
						<Pressable onPress={() => setIsModalOpen(false)} hitSlop={8}>
							<Ionicons name="close" size={24} color="#6b7280" />
						</Pressable>
					</View>

					<KeyboardView>
						<FormInput
							control={control}
							name="title"
							label="Adres Başlığı (örn: Ev, İş)"
							placeholder="Evim"
							error={errors.title?.message}
						/>

						<FormInput
							control={control}
							name="fullName"
							label="Teslim Alacak Kişi"
							placeholder="Ad Soyad"
							error={errors.fullName?.message}
						/>

						<FormInput
							control={control}
							name="phone"
							label="Telefon Numarası"
							placeholder="05XXXXXXXXX"
							error={errors.phone?.message}
							keyboardType="phone-pad"
						/>

						<View className="flex-row gap-3">
							<View className="flex-1">
								<FormInput
									control={control}
									name="city"
									label="İl"
									placeholder="İstanbul"
									error={errors.city?.message}
								/>
							</View>
							<View className="flex-1">
								<FormInput
									control={control}
									name="district"
									label="İlçe"
									placeholder="Kadıköy"
									error={errors.district?.message}
								/>
							</View>
						</View>

						<FormInput
							control={control}
							name="fullAddress"
							label="Açık Adres (Cadde, Sokak, No, Daire)"
							placeholder="Mahalle, Cadde, Bina No..."
							error={errors.fullAddress?.message}
							multiline
							numberOfLines={3}
							style={{ height: 80, textAlignVertical: "top" }}
						/>

						{formError && (
							<View className="bg-red-50 p-3 rounded-xl mb-4 border border-red-200">
								<Text className="text-dr-red text-sm font-medium">
									{formError}
								</Text>
							</View>
						)}

						<Button
							onPress={handleSubmit(handleAddAddress)}
							disabled={isSubmitting}
							className="h-12 justify-center mt-2 bg-dr-red mb-6"
						>
							<Text className="text-white font-bold text-base">
								{isSubmitting ? "Kaydediliyor..." : "Adresi Kaydet"}
							</Text>
						</Button>
					</KeyboardView>
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
}
