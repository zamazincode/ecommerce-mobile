import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveTokens,
} from "@/lib/auth/token-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
	constructor(
		public status: number,
		public problem: {
			title?: string;
			detail?: string;
			errors?: Record<string, string[]>;
		} | null,
	) {
		super(problem?.detail ?? problem?.title ?? "API hatası");
	}
}

type RequestOptions = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	auth?: boolean;
	headers?: Record<string, string>;
};

async function rawRequest(
	path: string,
	options: RequestOptions,
	token?: string | null,
) {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: options.method ?? "GET",
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
	});
	return res;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
	// Aynı anda birden fazla istek 401 alırsa, refresh'i sadece BİR KEZ çalıştır.
	if (!refreshPromise) {
		refreshPromise = (async () => {
			const refreshToken = await getRefreshToken();
			if (!refreshToken) return null;

			const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken }),
			});

			if (!res.ok) {
				await clearTokens();
				return null;
			}

			const data = await res.json();
			await saveTokens(data.accessToken, data.refreshToken);
			return data.accessToken as string;
		})().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}

export async function apiRequest<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	let token = options.auth ? await getAccessToken() : null;
	let res = await rawRequest(path, options, token);

	if (res.status === 401 && options.auth) {
		const newToken = await refreshAccessToken();
		if (!newToken) {
			throw new ApiError(401, null);
		}
		res = await rawRequest(path, options, newToken);
	}

	if (!res.ok) {
		let problem = null;
		try {
			problem = await res.json();
		} catch {
			// body boş olabilir
		}
		throw new ApiError(res.status, problem);
	}

	if (res.status === 204) return undefined as T; // DELETE gibi body'siz cevaplar
	return res.json();
}
