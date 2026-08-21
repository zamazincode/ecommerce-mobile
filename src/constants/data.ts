interface BannerItem {
	id: string;
	image: string;
	link?: string;
}

export const BANNERS: BannerItem[] = [
	{ id: "1", image: "https://picsum.photos/800/400?1" },
	{ id: "2", image: "https://picsum.photos/800/400?2" },
	{ id: "3", image: "https://picsum.photos/800/400?3" },
];
