import { Home } from "@/types/dtos";
import { apiRequest } from "./client";

export function getHome() {
	return apiRequest<Home>("/api/home");
}
