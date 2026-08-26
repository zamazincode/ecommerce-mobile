import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { getErrorMessage, getFieldErrors } from "@/lib/api/error-mapper";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
	const signIn = useAuthStore((s) => s.signIn);
	const [formError, setFormError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (values: LoginValues) => {
		setFormError(null);
		try {
			await signIn(values.email, values.password);
			router.replace("/");
		} catch (err) {
			const fieldErrors = getFieldErrors(err);
			Object.entries(fieldErrors).forEach(([field, message]) =>
				setError(field as keyof LoginValues, { message }),
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
						Giriş Yap
					</Text>
					<Text className="text-sm text-neutral-500 mt-1">
						Hesabınıza giriş yaparak alışverişinize devam edin.
					</Text>
				</View>

				<FormInput
					control={control}
					name="email"
					label="E-posta"
					placeholder="ornek@email.com"
					error={errors.email?.message}
					autoCapitalize="none"
					keyboardType="email-address"
					autoComplete="email"
				/>

				<FormInput
					control={control}
					name="password"
					label="Şifre"
					placeholder="••••••••"
					error={errors.password?.message}
					secureTextEntry
				/>

				<View className="items-end mb-6">
					<Link href="/(auth)/forgot-password" asChild>
						<Text className="text-xs font-semibold text-dr-red">
							Şifremi Unuttum
						</Text>
					</Link>
				</View>

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
					className="h-12 justify-center"
				>
					<Text className="text-white font-bold text-base">
						{isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
					</Text>
				</Button>

				<View className="flex-row items-center justify-center gap-1.5 mt-8">
					<Text className="text-sm text-neutral-600">
						Hesabınız yok mu?
					</Text>
					<Link href="/(auth)/register" asChild>
						<Text className="text-sm font-bold text-dr-red">
							Kayıt Ol
						</Text>
					</Link>
				</View>
			</KeyboardView>
		</SafeAreaView>
	);
}
