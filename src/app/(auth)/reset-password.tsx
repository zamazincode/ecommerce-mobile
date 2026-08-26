import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { resetPassword } from "@/lib/api/auth";
import { getErrorMessage, getFieldErrors } from "@/lib/api/error-mapper";
import {
	resetPasswordSchema,
	type ResetPasswordValues,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
	const params = useLocalSearchParams<{ email?: string; token?: string }>();
	const [formError, setFormError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: params.email ?? "",
			token: params.token ?? "",
			newPassword: "",
			newPasswordConfirm: "",
		},
	});

	const onSubmit = async (values: ResetPasswordValues) => {
		setFormError(null);
		try {
			await resetPassword({
				email: values.email,
				token: values.token,
				newPassword: values.newPassword,
			});
			setIsSuccess(true);
		} catch (err) {
			const fieldErrors = getFieldErrors(err);
			Object.entries(fieldErrors).forEach(([field, message]) =>
				setError(field as keyof ResetPasswordValues, { message }),
			);
			if (Object.keys(fieldErrors).length === 0) {
				setFormError(getErrorMessage(err));
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<KeyboardView>
				<View className="mb-8 mt-4">
					<Text className="text-2xl font-bold text-neutral-900">
						Şifre Sıfırlama
					</Text>
					<Text className="text-sm text-neutral-500 mt-1">
						E-postanıza gelen sıfırlama kodunu ve yeni şifrenizi girin.
					</Text>
				</View>

				{isSuccess ? (
					<View className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
						<Text className="text-base font-bold text-emerald-800 mb-1">
							Şifreniz Değiştirildi!
						</Text>
						<Text className="text-sm text-emerald-700 leading-5">
							Yeni şifreniz başarıyla kaydedildi. Artık giriş yapabilirsiniz.
						</Text>
						<Button
							onPress={() => router.replace("/(auth)/login")}
							className="mt-5 bg-emerald-600"
						>
							<Text className="text-white font-bold text-center">
								Giriş Yap
							</Text>
						</Button>
					</View>
				) : (
					<>
						<FormInput
							control={control}
							name="email"
							label="E-posta"
							placeholder="ornek@email.com"
							error={errors.email?.message}
							autoCapitalize="none"
							keyboardType="email-address"
						/>

						<FormInput
							control={control}
							name="token"
							label="Sıfırlama Kodu / Token"
							placeholder="E-postadaki kod"
							error={errors.token?.message}
							autoCapitalize="none"
						/>

						<FormInput
							control={control}
							name="newPassword"
							label="Yeni Şifre"
							placeholder="En az 8 karakter"
							error={errors.newPassword?.message}
							secureTextEntry
						/>

						<FormInput
							control={control}
							name="newPasswordConfirm"
							label="Yeni Şifre Tekrarı"
							placeholder="Şifrenizi tekrar girin"
							error={errors.newPasswordConfirm?.message}
							secureTextEntry
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
							className="h-12 justify-center mt-2"
						>
							<Text className="text-white font-bold text-base">
								{isSubmitting ? "Kaydediliyor..." : "Şifreyi Güncelle"}
							</Text>
						</Button>
					</>
				)}

				<View className="flex-row items-center justify-center gap-1.5 mt-8">
					<Link href="/(auth)/login" asChild>
						<Text className="text-sm font-bold text-neutral-600">
							← Giriş Ekranına Dön
						</Text>
					</Link>
				</View>
			</KeyboardView>
		</SafeAreaView>
	);
}
