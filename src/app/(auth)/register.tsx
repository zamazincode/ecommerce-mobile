import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { getErrorMessage, getFieldErrors } from "@/lib/api/error-mapper";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
	const signUp = useAuthStore((s) => s.signUp);
	const [formError, setFormError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirm: "",
		},
	});

	const onSubmit = async (values: RegisterValues) => {
		setFormError(null);
		try {
			await signUp({
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				password: values.password,
			});
			router.replace("/");
		} catch (err) {
			const fieldErrors = getFieldErrors(err);
			Object.entries(fieldErrors).forEach(([field, message]) =>
				setError(field as keyof RegisterValues, { message }),
			);
			if (Object.keys(fieldErrors).length === 0) {
				setFormError(getErrorMessage(err));
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<KeyboardView>
				<View className="mb-6 mt-2">
					<Text className="text-2xl font-bold text-neutral-900">
						Hesap Oluştur
					</Text>
					<Text className="text-sm text-neutral-500 mt-1">
						Avantajlı fiyatlar ve hızlı sipariş için üye olun.
					</Text>
				</View>

				<View className="flex-row gap-3">
					<View className="flex-1">
						<FormInput
							control={control}
							name="firstName"
							label="Ad"
							placeholder="Ahmet"
							error={errors.firstName?.message}
						/>
					</View>
					<View className="flex-1">
						<FormInput
							control={control}
							name="lastName"
							label="Soyad"
							placeholder="Yılmaz"
							error={errors.lastName?.message}
						/>
					</View>
				</View>

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
					name="password"
					label="Şifre"
					placeholder="En az 8 karakter"
					error={errors.password?.message}
					secureTextEntry
				/>

				<FormInput
					control={control}
					name="passwordConfirm"
					label="Şifre Tekrarı"
					placeholder="Şifrenizi tekrar girin"
					error={errors.passwordConfirm?.message}
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
						{isSubmitting ? "Kayıt olunuyor..." : "Kayıt Ol"}
					</Text>
				</Button>

				<View className="flex-row items-center justify-center gap-1.5 mt-6 mb-4">
					<Text className="text-sm text-neutral-600">
						Zaten hesabınız var mı?
					</Text>
					<Link href="/(auth)/login" asChild>
						<Text className="text-sm font-bold text-dr-red">
							Giriş Yap
						</Text>
					</Link>
				</View>
			</KeyboardView>
		</SafeAreaView>
	);
}
