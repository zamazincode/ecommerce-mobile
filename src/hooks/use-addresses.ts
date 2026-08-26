import { getAddresses } from "@/lib/api/address";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";

export function useAddresses() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery({
		queryKey: queryKeys.addresses,
		queryFn: getAddresses,
		enabled: isAuthenticated,
	});
}

export default useAddresses;
