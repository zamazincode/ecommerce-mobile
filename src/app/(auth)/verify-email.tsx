import Button from "@/components/ui/button";
import { KeyboardView } from "@/components/ui/keyboard-view";
import { verifyEmail } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/error-mapper";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
	const params = useLocalSearchParams<{ token?: string }>();
	const [token, setToken] = useState(params.token ?? "");

	const { mutate, isPending, isSuccess, isError, error } = useMutation({
		mutationFn: (tokenToVerify: string) => verifyEmail(tokenToVerify),
	});

	useEffect(() => {
		if (params.token) {
			mutate(params.token);
		}
	}, [params.token, mutate]);

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
			<KeyboardView>
				<View className="mb-8 mt-4 items-center">
					<View className="w-16 h-16 rounded-full bg-neutral-100 items-center justify-center mb-4">
						<Ionicons name="mail-open-outline" size={32} color="#002B49" />
					</View>
					<Text className="text-2xl font-bold text-neutral-900 text-center">
						E-posta Doğrulama
					</Text>
					<Text className="text-sm text-neutral-500 text-center mt-1">
						Hesabınızı aktifleştirmek için e-postanıza gönderilen onay kodunu doğrulayın.
					</Text>
				</View>

				{isPending && (
					<View className="py-12 items-center justify-center">
						<ActivityIndicator size="large" color="#E30613" />
						<Text className="text-sm text-neutral-500 mt-3">
							Doğrulanıyor...
						</Text>
					</View>
				)}

				{isSuccess && (
					<View className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
						<Text className="text-base font-bold text-emerald-800 mb-1">
							E-posta Başarıyla Doğrulandı!
						</Text>
						<Text className="text-sm text-emerald-700 leading-5">
							Hesabınız aktif edildi. Artık tüm özellikleri kullanabilirsiniz.
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
				)}

				{!isSuccess && !isPending && (
					<View className="gap-4">
						<View>
							<Text className="text-sm font-medium text-neutral-700 mb-1.5">
								Doğrulama Kodu / Token
							</Text>
							<TextInput
								value={token}
								onChangeText={setToken}
								placeholder="E-postadaki doğrulama kodunu girin"
								placeholderTextColor="#9CA3AF"
								className="h-12 px-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 text-sm"
								autoCapitalize="none"
							/>
						</View>

						{isError && (
							<View className="bg-red-50 p-3 rounded-xl border border-red-200">
								<Text className="text-dr-red text-sm font-medium">
									{getErrorMessage(error)}
								</Text>
							</View>
						)}

						<Button
							onPress={() => mutate(token.trim())}
							disabled={!token.trim()}
							className="h-12 justify-center"
						>
							<Text className="text-white font-bold text-base">
								Doğrula
							</Text>
						</Button>
					</View>
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
