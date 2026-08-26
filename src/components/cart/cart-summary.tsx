import { useApplyCoupon, useRemoveCoupon } from "@/hooks/use-coupon";
import { formatPrice, toNumber } from "@/lib/utils/format";
import type { Cart } from "@/types/dtos";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";

type Props = {
	cart: Cart;
};

export function CartSummary({ cart }: Props) {
	const [couponInput, setCouponInput] = useState("");
	const [couponError, setCouponError] = useState<string | null>(null);

	const applyCouponMutation = useApplyCoupon();
	const removeCouponMutation = useRemoveCoupon();

	const subTotal = toNumber(cart.subTotal);
	const discountAmount = toNumber(cart.discountAmount);
	const shippingCost = toNumber(cart.shippingCost);
	const total = toNumber(cart.total);
	const freeShippingRemaining = toNumber(cart.freeShippingRemaining);

	const handleApplyCoupon = async () => {
		if (!couponInput.trim()) return;
		setCouponError(null);
		try {
			await applyCouponMutation.mutateAsync(couponInput.trim().toUpperCase());
			setCouponInput("");
		} catch (err: any) {
			setCouponError(err?.message ?? "Geçersiz indirim kuponu.");
		}
	};

	const handleRemoveCoupon = async () => {
		setCouponError(null);
		try {
			await removeCouponMutation.mutateAsync();
		} catch (err: any) {
			setCouponError(err?.message ?? "Kupon kaldırılamadı.");
		}
	};

	return (
		<View className="bg-white p-5 rounded-2xl border border-neutral-100 mb-6">
			{/* Ücretsiz Kargo İlerleme / Bilgisi */}
			{freeShippingRemaining > 0 ? (
				<View className="bg-amber-50 p-3 rounded-xl mb-4 border border-amber-200/80 flex-row items-center gap-2">
					<Ionicons name="car-outline" size={20} color="#d97706" />
					<Text className="text-xs text-amber-900 flex-1 leading-4 font-medium">
						<Text className="font-bold text-amber-900">
							{formatPrice(freeShippingRemaining)}
						</Text>{" "}
						değerinde daha ürün ekleyin, kargo bedava olsun!
					</Text>
				</View>
			) : (
				<View className="bg-emerald-50 p-3 rounded-xl mb-4 border border-emerald-200/80 flex-row items-center gap-2">
					<Ionicons name="checkmark-circle-outline" size={20} color="#059669" />
					<Text className="text-xs text-emerald-900 font-semibold">
						Kargonuz Ücretsiz!
					</Text>
				</View>
			)}

			{/* Kupon Kodu Alanı */}
			<View className="mb-5">
				<Text className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
					İndirim Kuponu
				</Text>

				{cart.couponCode ? (
					<View className="flex-row items-center justify-between bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200">
						<View className="flex-row items-center gap-2">
							<Feather name="tag" size={16} color="#E30613" />
							<Text className="text-sm font-bold text-neutral-900">
								{cart.couponCode}
							</Text>
						</View>
						<Pressable
							onPress={handleRemoveCoupon}
							disabled={removeCouponMutation.isPending}
							className="p-1"
						>
							{removeCouponMutation.isPending ? (
								<ActivityIndicator size="small" color="#9ca3af" />
							) : (
								<Ionicons name="close-circle" size={18} color="#9ca3af" />
							)}
						</Pressable>
					</View>
				) : (
					<View className="flex-row gap-2">
						<TextInput
							value={couponInput}
							onChangeText={setCouponInput}
							placeholder="Kupon Kodu"
							placeholderTextColor="#9ca3af"
							autoCapitalize="characters"
							className="flex-1 h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-sm"
						/>
						<Pressable
							onPress={handleApplyCoupon}
							disabled={!couponInput.trim() || applyCouponMutation.isPending}
							className={`h-11 px-4 rounded-xl items-center justify-center ${
								!couponInput.trim() || applyCouponMutation.isPending
									? "bg-neutral-200"
									: "bg-neutral-900 active:opacity-90"
							}`}
						>
							{applyCouponMutation.isPending ? (
								<ActivityIndicator size="small" color="#ffffff" />
							) : (
								<Text className="text-white text-sm font-bold">Uygula</Text>
							)}
						</Pressable>
					</View>
				)}

				{couponError && (
					<Text className="text-xs text-dr-red mt-1.5 font-medium">
						{couponError}
					</Text>
				)}
			</View>

			{/* Fiyat Detayları Tablosu */}
			<View className="gap-2.5 border-t border-neutral-100 pt-4">
				<View className="flex-row justify-between">
					<Text className="text-sm text-neutral-600">Ara Toplam</Text>
					<Text className="text-sm font-semibold text-neutral-900">
						{formatPrice(subTotal)}
					</Text>
				</View>

				{discountAmount > 0 && (
					<View className="flex-row justify-between">
						<Text className="text-sm text-emerald-600">İndirim</Text>
						<Text className="text-sm font-semibold text-emerald-600">
							-{formatPrice(discountAmount)}
						</Text>
					</View>
				)}

				<View className="flex-row justify-between">
					<Text className="text-sm text-neutral-600">Kargo Ücreti</Text>
					<Text className="text-sm font-semibold text-neutral-900">
						{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
					</Text>
				</View>

				<View className="flex-row justify-between items-baseline pt-3 border-t border-neutral-200 mt-1">
					<Text className="text-base font-bold text-neutral-900">Toplam</Text>
					<Text className="text-xl font-bold text-dr-red">
						{formatPrice(total)}
					</Text>
				</View>
			</View>
		</View>
	);
}

export default CartSummary;
