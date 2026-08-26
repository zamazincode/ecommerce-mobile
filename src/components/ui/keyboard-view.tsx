import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export function KeyboardView({ children }: { children: React.ReactNode }) {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
		>
			<ScrollView
				contentContainerClassName="flex-grow px-4 py-6"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

export default KeyboardView;
