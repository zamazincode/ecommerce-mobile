import { z } from "zod";

export const addressSchema = z.object({
	title: z.string().min(1, "Adres başlığı zorunlu (örn: Ev, İş)"),
	fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalı"),
	phone: z
		.string()
		.min(10, "Geçerli bir telefon numarası girin (5XXXXXXXXX)"),
	city: z.string().min(1, "İl seçimi zorunlu"),
	district: z.string().min(1, "İlçe seçimi zorunlu"),
	fullAddress: z.string().min(10, "Açık adres en az 10 karakter olmalı"),
	isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
