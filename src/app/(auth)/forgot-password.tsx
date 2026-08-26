import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { forgotPassword } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/error-mapper";
import {
	forgotPasswordSchema,
	type ForgotPasswordValues,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (values: ForgotPasswordValues) => {
		setFormError(null);
		try {
			await forgotPassword(values.email);
			setIsSubmitted(true);
		} catch (err) {
			setFormError(getErrorMessage(err));
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<KeyboardView>
				<View className="mb-8 mt-4">
					<Text className="text-2xl font-bold text-neutral-900">
						Şifremi Unuttum
					</Text>
					<Text className="text-sm text-neutral-500 mt-1">
						Kayıtlı e-posta adresinizi girin, sıfırlama talimatlarını gönderelim.
					</Text>
				</View>

				{isSubmitted ? (
					<View className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
						<Text className="text-base font-bold text-emerald-800 mb-1">
							Bağlantı Gönderildi!
						</Text>
						<Text className="text-sm text-emerald-700 leading-5">
							E-posta adresinize şifre sıfırlama talimatları gönderildi. Lütfen gelen kutunuzu kontrol edin.
						</Text>
						<Button
							onPress={() => router.push("/(auth)/reset-password")}
							className="mt-5 bg-emerald-600"
						>
							<Text className="text-white font-bold text-center">
								Kodu Girerek Sıfırla
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
								{isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
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
