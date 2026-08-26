import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "E-posta zorunlu")
		.email("Geçerli bir e-posta girin"),
	password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
		lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
		email: z
			.string()
			.min(1, "E-posta zorunlu")
			.email("Geçerli bir e-posta girin"),
		password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
		passwordConfirm: z.string().min(1, "Şifre tekrarı zorunlu"),
	})
	.refine((v) => v.password === v.passwordConfirm, {
		message: "Şifreler eşleşmiyor",
		path: ["passwordConfirm"],
	});
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "E-posta zorunlu")
		.email("Geçerli bir e-posta girin"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({
		email: z
			.string()
			.min(1, "E-posta zorunlu")
			.email("Geçerli bir e-posta girin"),
		token: z.string().min(1, "Sıfırlama kodu zorunlu"),
		newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı"),
		newPasswordConfirm: z.string().min(1, "Şifre tekrarı zorunlu"),
	})
	.refine((v) => v.newPassword === v.newPasswordConfirm, {
		message: "Şifreler eşleşmiyor",
		path: ["newPasswordConfirm"],
	});
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
