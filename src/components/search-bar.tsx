import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface SearchBarProps {
	placeholder?: string;
	onSearch?: (text: string) => void;
	onBarcodePress?: () => void;
}

export default function SearchBar({
	placeholder = "Kitap, yazar, yayınevi veya ürün ara...",
	onSearch,
	onBarcodePress,
}: SearchBarProps) {
	const [query, setQuery] = useState("");

	const handleChange = (text: string) => {
		setQuery(text);
		onSearch?.(text);
	};

	const handleClear = () => {
		setQuery("");
		onSearch?.("");
	};

	return (
		<View className="px-4 py-2">
			<View className="flex-row items-center bg-neutral-100 rounded-xl px-3.5 h-12 border border-neutral-200">
				{/* Sol Arama İkonu */}
				<Feather name="search" size={20} color="#6B7280" />

				{/* Metin Giriş Alanı */}
				<TextInput
					value={query}
					onChangeText={handleChange}
					placeholder={placeholder}
					placeholderTextColor="#9CA3AF"
					className="flex-1 ml-2.5 text-neutral-900 text-sm h-full"
					returnKeyType="search"
				/>

				{/* Yazı varsa Temizleme (X) butonu, yoksa Barkod/Kamera butonu */}
				{query.length > 0 ? (
					<Pressable
						onPress={handleClear}
						hitSlop={8}
						className="p-1"
					>
						<Ionicons
							name="close-circle"
							size={18}
							color="#9CA3AF"
						/>
					</Pressable>
				) : (
					<Pressable
						onPress={onBarcodePress}
						hitSlop={8}
						className="p-1"
					>
						<Ionicons
							name="barcode-outline"
							size={22}
							color="#002B49"
						/>
					</Pressable>
				)}
			</View>
		</View>
	);
}
