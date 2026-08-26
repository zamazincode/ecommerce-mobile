import type { components } from "@/types/api";
import { Text, View } from "react-native";

type BookDetail = components["schemas"]["BookDetailDto"];

type Props = {
	detail: BookDetail;
};

export function BookDetailTable({ detail }: Props) {
	const rows: { label: string; value: string | number | null | undefined }[] = [
		{ label: "ISBN", value: detail.isbn },
		{ label: "Sayfa Sayısı", value: detail.pageCount ? String(detail.pageCount) : null },
		{ label: "Dil", value: detail.language },
		{ label: "Basım Yılı", value: detail.publishedYear ? String(detail.publishedYear) : null },
	];

	const activeRows = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");

	if (activeRows.length === 0) return null;

	return (
		<View className="my-5 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
			<Text className="text-base font-bold text-neutral-900 mb-3">
				Kitap Özellikleri
			</Text>

			<View className="gap-2.5">
				{activeRows.map((row, index) => (
					<View
						key={row.label}
						className={`flex-row justify-between py-1.5 ${
							index < activeRows.length - 1 ? "border-b border-neutral-200/60" : ""
						}`}
					>
						<Text className="text-sm text-neutral-500 font-medium">{row.label}</Text>
						<Text className="text-sm text-neutral-900 font-semibold">{row.value}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

export default BookDetailTable;
