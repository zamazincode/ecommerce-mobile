import type { components } from "@/types/api";
import type { User } from "@/types/dtos";
import { apiRequest } from "./client";

type AuthResponse = components["schemas"]["AuthResponse"];
type RegisterRequest = components["schemas"]["RegisterRequest"];
type ResetPasswordRequest = components["schemas"]["ResetPasswordRequest"];

export function login(email: string, password: string) {
	return apiRequest<AuthResponse>("/api/auth/login", {
		method: "POST",
		body: { email, password },
	});
}

export function register(body: RegisterRequest) {
	return apiRequest<AuthResponse>("/api/auth/register", {
		method: "POST",
		body,
	});
}

export function getMe() {
	return apiRequest<User>("/api/auth/me", { auth: true }); // Bearer gerekli
}

export function logout(refreshToken: string) {
	return apiRequest<void>("/api/auth/logout", {
		method: "POST",
		auth: true,
		body: { refreshToken },
	});
}

export function forgotPassword(email: string) {
	return apiRequest<{ message?: string }>("/api/auth/forgot-password", {
		method: "POST",
		body: { email },
	});
}

export function resetPassword(body: ResetPasswordRequest) {
	return apiRequest<{ message?: string }>("/api/auth/reset-password", {
		method: "POST",
		body,
	});
}

export function verifyEmail(token: string) {
	return apiRequest<{ message?: string }>(
		`/api/auth/verify-email?token=${encodeURIComponent(token)}`,
		{ method: "POST" },
	);
}
