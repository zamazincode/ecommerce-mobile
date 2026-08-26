import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Text, TextInput, View, type TextInputProps } from "react-native";

type Props<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	label: string;
	error?: string;
} & Omit<TextInputProps, "value" | "onChangeText">;

export function FormInput<T extends FieldValues>({
	control,
	name,
	label,
	error,
	...inputProps
}: Props<T>) {
	return (
		<View className="mb-4">
			<Text className="text-sm font-medium text-neutral-700 mb-1.5">{label}</Text>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						value={value ?? ""}
						onChangeText={onChange}
						onBlur={onBlur}
						className={`h-12 px-3.5 rounded-xl border bg-white text-neutral-900 text-sm ${
							error ? "border-dr-red bg-red-50/30" : "border-neutral-200"
						}`}
						placeholderTextColor="#9CA3AF"
						{...inputProps}
					/>
				)}
			/>
			{error ? <Text className="text-xs text-dr-red mt-1">{error}</Text> : null}
		</View>
	);
}

export default FormInput;
