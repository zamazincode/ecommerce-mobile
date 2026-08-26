import * as authApi from "@/lib/api/auth";
import { mergeGuestCart } from "@/lib/api/cart";
import { queryKeys } from "@/lib/api/query-keys";
import {
	clearTokens,
	getRefreshToken,
	saveTokens,
} from "@/lib/auth/token-storage";
import { queryClient } from "@/lib/query-client";
import type { User } from "@/types/dtos";
import { create } from "zustand";

type AuthState = {
	user: User | null;
	isAuthenticated: boolean;
	isHydrating: boolean; // Açılışta token kontrolü sürüyor mu
	bootstrap: () => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (
		data: Parameters<typeof authApi.register>[0],
	) => Promise<void>;
	signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isHydrating: true,

	bootstrap: async () => {
		const refreshToken = await getRefreshToken();
		if (!refreshToken) {
			set({ isHydrating: false });
			return;
		}
		try {
			// client.ts içindeki 401 -> refresh akışı burada otomatik devreye girer
			const user = await authApi.getMe();
			set({ user, isAuthenticated: true, isHydrating: false });
		} catch {
			await clearTokens();
			set({ user: null, isAuthenticated: false, isHydrating: false });
		}
	},

	signIn: async (email, password) => {
		const res = await authApi.login(email, password);
		await saveTokens(res.accessToken, res.refreshToken);
		set({ user: res.user, isAuthenticated: true });

		try {
			const merged = await mergeGuestCart();
			queryClient.setQueryData(queryKeys.cart, merged);
		} catch {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart });
		}
	},

	signUp: async (data) => {
		const res = await authApi.register(data);
		await saveTokens(res.accessToken, res.refreshToken);
		set({ user: res.user, isAuthenticated: true });

		try {
			const merged = await mergeGuestCart();
			queryClient.setQueryData(queryKeys.cart, merged);
		} catch {
			queryClient.invalidateQueries({ queryKey: queryKeys.cart });
		}
	},

	signOut: async () => {
		const refreshToken = await getRefreshToken();
		try {
			if (refreshToken) await authApi.logout(refreshToken);
		} catch {
			// Sunucu hata verse de yerel çıkış yapılmalı
		}
		await clearTokens();
		queryClient.clear(); // Kullanıcı çıkışında tüm query cache temizlenir
		set({ user: null, isAuthenticated: false });
	},
}));

export default useAuthStore;
