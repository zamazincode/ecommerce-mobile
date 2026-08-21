/** API sayilari "number | string" olarak dondurebiliyor */
export function toNumber(value: number | string | null | undefined): number {
	if (value === null || value === undefined) return 0;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}

const priceFormatter = new Intl.NumberFormat("tr-TR", {
	style: "currency",
	currency: "TRY",
	minimumFractionDigits: 2,
});

export function formatPrice(value: number | string | null | undefined): string {
	return priceFormatter.format(toNumber(value)); // 149.9 -> "149,90 TL"
}

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
	day: "2-digit",
	month: "long",
	year: "numeric",
});

export function formatDate(iso: string | null | undefined): string {
	if (!iso) return "";
	return dateFormatter.format(new Date(iso));
}

/** Indirim yuzdesi: 100 -> 75 ise %25 */
export function discountPercent(
	price: number | string,
	effectivePrice: number | string,
): number | null {
	const p = toNumber(price);
	const e = toNumber(effectivePrice);
	if (p <= 0 || e >= p) return null;
	return Math.round(((p - e) / p) * 100);
}
