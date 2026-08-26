import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(timer); // her yeni tuşta öncekini iptal et
	}, [value, delayMs]);

	return debounced;
}

export default useDebouncedValue;
