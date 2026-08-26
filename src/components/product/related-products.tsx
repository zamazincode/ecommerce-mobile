import ProductRow from "@/components/product/product-row";
import { SectionHeader } from "@/components/ui/section-header";
import { useRelatedProducts } from "@/hooks/use-related-products";
import { View } from "react-native";

export function RelatedProducts({
	productId,
}: {
	productId: number | string | undefined;
}) {
	const { data: products, isLoading } = useRelatedProducts(productId);

	if (isLoading || !products || products.length === 0) return null;

	return (
		<View className="mt-4 mb-6">
			<SectionHeader title="Benzer Ürünler" />
			<ProductRow products={products} />
		</View>
	);
}

export default RelatedProducts;
