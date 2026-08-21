import { Product } from "@/types/dtos";
import { FlatList } from "react-native";
import ProductCard from "./product-card";

export default function ProductRow({ products }: { products: Product[] }) {
	return (
		<FlatList
			data={products}
			keyExtractor={(item) => String(item.id)}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerClassName="px-4 gap-4"
			renderItem={({ item }) => (
				<ProductCard product={item} width={140} />
			)}
		/>
	);
}
