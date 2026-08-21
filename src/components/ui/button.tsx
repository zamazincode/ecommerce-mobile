import React from "react";
import { Pressable, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
	children: React.ReactNode;
	className?: string;
}

export default function Button({
	children,
	className = "",
	disabled,
	...props
}: ButtonProps) {
	return (
		<Pressable
			disabled={disabled}
			className={`bg-dr-red py-2.5 px-4 rounded-lg items-center justify-center active:bg-dr-red-dark ${
				disabled ? "opacity-50" : ""
			} ${className}`}
			{...props}
		>
			{children}
		</Pressable>
	);
}
