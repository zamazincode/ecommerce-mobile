import { ApiError } from "./client";

/** ProblemDetails.errors: { "Email": ["Bu e-posta zaten kayıtlı"] } */
export function getFieldErrors(error: unknown): Record<string, string> {
	if (error instanceof ApiError && error.problem?.errors) {
		return Object.fromEntries(
			Object.entries(error.problem.errors).map(([field, messages]) => [
				field.charAt(0).toLowerCase() + field.slice(1), // "Email" -> "email"
				messages[0] ?? "Geçersiz değer",
			]),
		);
	}
	return {};
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof ApiError) return error.message;
	if (error instanceof Error) return error.message;
	return "Beklenmeyen bir hata oluştu.";
}
