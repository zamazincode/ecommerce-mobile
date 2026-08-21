import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
	return (
		<NativeTabs>
			<NativeTabs.Trigger name="index">
				<NativeTabs.Trigger.Label>Anasayfa</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="house.fill" md="home" />
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="category">
				<NativeTabs.Trigger.Icon
					sf="square.grid.2x2.fill"
					md="grid_view"
				/>
				<NativeTabs.Trigger.Label>Kategori</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="cart">
				<NativeTabs.Trigger.Icon sf="cart.fill" md="shopping_cart" />
				<NativeTabs.Trigger.Label>Sepetim</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="favorites">
				<NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" />
				<NativeTabs.Trigger.Label>Favorilerim</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name="account">
				<NativeTabs.Trigger.Icon sf="person.fill" md="person" />
				<NativeTabs.Trigger.Label>Hesabım</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
