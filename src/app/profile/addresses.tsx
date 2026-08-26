import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useAddresses } from "@/hooks/use-addresses";
import { useDeleteAddress, useSaveAddress } from "@/hooks/use-save-address";
import { getErrorMessage } from "@/lib/api/error-mapper";
import { addressSchema, type AddressFormValues } from "@/lib/validation/address";
import type { Address } from "@/types/dtos";
import { Feather, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Alert,
	FlatList,
	Modal,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileAddressesScreen() {
	const { data: addresses, isLoading, isError, refetch } = useAddresses();
	const saveAddressMutation = useSaveAddress();
	const deleteAddressMutation = useDeleteAddress();

	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		reset,
		setValue,
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

	const openNewModal = () => {
		setEditingAddress(null);
		reset({
			title: "Ev",
			fullName: "",
			phone: "",
			city: "İstanbul",
			district: "Kadıköy",
			fullAddress: "",
			isDefault: false,
		});
		setIsModalOpen(true);
	};

	const openEditModal = (address: Address) => {
		setEditingAddress(address);
		setValue("title", address.title);
		setValue("fullName", address.fullName);
		setValue("phone", address.phone);
		setValue("city", address.city);
		setValue("district", address.district);
		setValue("fullAddress", address.fullAddress);
		setValue("isDefault", address.isDefault ?? false);
		setIsModalOpen(true);
	};

	const handleDelete = (address: Address) => {
		Alert.alert(
			"Adresi Sil",
			`"${address.title}" adresini silmek istediğinize emin misiniz?`,
			[
				{ text: "Vazgeç", style: "cancel" },
				{
					text: "Sil",
					style: "destructive",
					onPress: () => deleteAddressMutation.mutate(address.id),
				},
			],
		);
	};

	const onSubmit = async (values: AddressFormValues) => {
		setFormError(null);
		try {
			await saveAddressMutation.mutateAsync({
				id: editingAddress?.id,
				data: values,
			});
			setIsModalOpen(false);
		} catch (err) {
			setFormError(getErrorMessage(err));
		}
	};

	if (isLoading) return <LoadingState label="Adresler yükleniyor..." />;
	if (isError) return <ErrorState message="Adresler alınamadı." onRetry={refetch} />;

	const addressList = addresses ?? [];

	return (
		<SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
			<Stack.Screen
				options={{
					title: "Adreslerim",
					headerShown: true,
					headerBackTitle: "Profil",
				}}
			/>

			<View className="flex-1 p-4">
				<View className="flex-row items-center justify-between mb-4">
					<Text className="text-base font-bold text-neutral-900">
						Kayıtlı Teslimat Adresleri
					</Text>
					<Pressable
						onPress={openNewModal}
						className="flex-row items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200/60 active:opacity-80"
					>
						<Feather name="plus" size={16} color="#E30613" />
						<Text className="text-xs font-bold text-dr-red">Yeni Ekle</Text>
					</Pressable>
				</View>

				{addressList.length === 0 ? (
					<View className="flex-1 justify-center">
						<EmptyState
							title="Kayıtlı Adres Yok"
							description="Henüz bir teslimat adresi eklemediniz."
						/>
						<Button onPress={openNewModal} className="mx-8 mt-6 bg-dr-red">
							<Text className="text-white font-bold text-center">
								Yeni Adres Ekle
							</Text>
						</Button>
					</View>
				) : (
					<FlatList
						data={addressList}
						keyExtractor={(item) => String(item.id)}
						contentContainerClassName="gap-3 pb-8"
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<View className="p-4 rounded-2xl border border-neutral-200 bg-white">
								<View className="flex-row items-center justify-between mb-2">
									<View className="flex-row items-center gap-2">
										<Ionicons name="home-outline" size={18} color="#002B49" />
										<Text className="text-base font-bold text-neutral-900">
											{item.title}
										</Text>
										{item.isDefault && (
											<View className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
												<Text className="text-[10px] font-bold text-emerald-700">
													Varsayılan
												</Text>
											</View>
										)}
									</View>

									<View className="flex-row items-center gap-3">
										<Pressable
											onPress={() => openEditModal(item)}
											hitSlop={8}
										>
											<Feather name="edit-2" size={16} color="#6b7280" />
										</Pressable>
										<Pressable
											onPress={() => handleDelete(item)}
											hitSlop={8}
										>
											<Feather name="trash-2" size={16} color="#ef4444" />
										</Pressable>
									</View>
								</View>

								<Text className="text-sm font-semibold text-neutral-800">
									{item.fullName} • {item.phone}
								</Text>
								<Text className="text-xs text-neutral-500 mt-1 leading-5">
									{item.fullAddress}
								</Text>
								<Text className="text-xs font-medium text-neutral-700 mt-0.5">
									{item.district} / {item.city}
								</Text>
							</View>
						)}
					/>
				)}
			</View>

			{/* Modal Form */}
			<Modal
				visible={isModalOpen}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setIsModalOpen(false)}
			>
				<SafeAreaView className="flex-1 bg-white">
					<View className="px-5 py-4 border-b border-neutral-100 flex-row items-center justify-between">
						<Text className="text-lg font-bold text-neutral-900">
							{editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
						</Text>
						<Pressable onPress={() => setIsModalOpen(false)} hitSlop={8}>
							<Ionicons name="close" size={24} color="#6b7280" />
						</Pressable>
					</View>

					<KeyboardView>
						<FormInput
							control={control}
							name="title"
							label="Adres Başlığı"
							placeholder="Ev, İş"
							error={errors.title?.message}
						/>

						<FormInput
							control={control}
							name="fullName"
							label="Ad Soyad"
							placeholder="Ahmet Yılmaz"
							error={errors.fullName?.message}
						/>

						<FormInput
							control={control}
							name="phone"
							label="Telefon"
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
							label="Açık Adres"
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
							onPress={handleSubmit(onSubmit)}
							disabled={isSubmitting}
							className="h-12 justify-center mt-2 bg-dr-red mb-6"
						>
							<Text className="text-white font-bold text-base">
								{isSubmitting ? "Kaydediliyor..." : "Kaydet"}
							</Text>
						</Button>
					</KeyboardView>
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
}
