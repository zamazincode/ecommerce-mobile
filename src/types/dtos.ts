import type { components } from "./api";

type S = components["schemas"];

export type Product = S["ProductListDto"];
export type ProductDetail = S["ProductDetailDto"];
export type Home = S["HomeDto"];
export type Cart = S["CartDto"];
export type CartItem = S["CartItemDto"];
export type CategoryTree = S["CategoryTreeDto"];
export type Suggestion = S["SuggestionDto"];
export type SearchResult = S["SearchResultDto"];
export type PagedProducts = S["PagedResultOfProductListDto"];
export type OrderDetail = S["OrderDetailDto"];
export type Address = S["AddressDto"];
export type User = S["UserDto"];
