import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function QueryProvider({ children }: PropsWithChildren) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30 * 1000, // 30 sn boyunca veri "taze" sayılır, tekrar fetch etmez
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	);
}
