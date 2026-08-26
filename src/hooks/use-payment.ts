import { getPaymentStatus, initializePayment } from "@/lib/api/payment";
import { useQuery } from "@tanstack/react-query";

export function usePaymentInit(orderNumber?: string) {
	return useQuery({
		queryKey: ["payment-init", orderNumber],
		queryFn: () => initializePayment(orderNumber!),
		enabled: Boolean(orderNumber),
		staleTime: Infinity, // Bir defa başlatılır
	});
}

export function usePaymentStatus(orderNumber?: string) {
	return useQuery({
		queryKey: ["payment-status", orderNumber],
		queryFn: () => getPaymentStatus(orderNumber!),
		enabled: Boolean(orderNumber),
		refetchInterval: (query) => {
			const data = query.state.data;
			// 0 = Pending, 1 = Success / Paid, 2 = Failed
			// Henüz sonuçlanmadıysa 3 sn'de bir sorgula
			if (!data || data.paymentStatus === null || data.orderStatus === 0) {
				return 3000;
			}
			return false; // Sonuçlandıysa dur
		},
	});
}
