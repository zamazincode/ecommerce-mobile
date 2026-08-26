import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface SearchBarProps {
	placeholder?: string;
	value?: string;
	onChangeText?: (text: string) => void;
	onSubmitEditing?: () => void;
	onSearch?: (text: string) => void;
	onBarcodePress?: () => void;
	editable?: boolean;
	onPress?: () => void;
	autoFocus?: boolean;
}

export default function SearchBar({
	placeholder = "Kitap, yazar, yayınevi veya ürün ara...",
	value,
	onChangeText,
	onSubmitEditing,
	onSearch,
	onBarcodePress,
	editable = true,
	onPress,
	autoFocus = false,
}: SearchBarProps) {
	const [internalQuery, setInternalQuery] = useState("");

	const isControlled = value !== undefined;
	const currentQuery = isControlled ? value : internalQuery;

	const handleChange = (text: string) => {
		if (!isControlled) {
			setInternalQuery(text);
		}
		onChangeText?.(text);
		onSearch?.(text);
	};

	const handleClear = () => {
		if (!isControlled) {
			setInternalQuery("");
		}
		onChangeText?.("");
		onSearch?.("");
	};

	const content = (
		<View className="flex-row items-center bg-neutral-100 rounded-xl px-3.5 h-12 border border-neutral-200">
			{/* Sol Arama İkonu */}
			<Feather name="search" size={20} color="#6B7280" />

			{/* Metin Giriş Alanı */}
			<TextInput
				value={currentQuery}
				onChangeText={handleChange}
				onSubmitEditing={onSubmitEditing}
				placeholder={placeholder}
				placeholderTextColor="#9CA3AF"
				className="flex-1 ml-2.5 text-neutral-900 text-sm h-full"
				returnKeyType="search"
				editable={editable && !onPress}
				autoFocus={autoFocus}
				autoCapitalize="none"
				autoCorrect={false}
			/>

			{/* Yazı varsa Temizleme (X) butonu, yoksa Barkod butonu */}
			{currentQuery.length > 0 ? (
				<Pressable onPress={handleClear} hitSlop={8} className="p-1">
					<Ionicons name="close-circle" size={18} color="#9CA3AF" />
				</Pressable>
			) : (
				onBarcodePress && (
					<Pressable onPress={onBarcodePress} hitSlop={8} className="p-1">
						<Ionicons name="barcode-outline" size={22} color="#002B49" />
					</Pressable>
				)
			)}
		</View>
	);

	if (onPress || !editable) {
		return (
			<View className="px-4 py-2">
				<Pressable onPress={onPress} className="active:opacity-90">
					{content}
				</Pressable>
			</View>
		);
	}

	return <View className="px-4 py-2">{content}</View>;
}
