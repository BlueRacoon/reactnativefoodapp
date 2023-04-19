/* eslint-disable prettier/prettier */
import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { RestaurantsSettingsScreen } from "../../features/settings/screens/restaurant-settings.screen";
import { CameraScreen } from "../../features/settings/screens/camera.screens";
import { PrinterScreen } from "../../features/settings/screens/printer.screen";
import { RestaurantsPastOrders } from "../../features/settings/screens/restaurants-past-orders.screen";
import { ViewSingleOldOrder } from "../../features/orders/screens/view-single-old-order.screen";
import { ChangeAddressScreen } from "../../features/settings/screens/change-location.screen";
import { HoursScreen } from "../../features/hours/screens/hours.screen";
import { MenuScreen } from "../../features/menu/screens/menu.screen";
import { EditMenuItem } from "../../features/menu/screens/edit-menu-item-screen";

const RestaurantsSettingsStack = createStackNavigator();

export const RestaurantsSettingsNavigator = ({ route, navigation }) => {
  return (
    <RestaurantsSettingsStack.Navigator
      screenOptions={{
        headerShown: "screen",
        CardStyleInterpolators: CardStyleInterpolators.forHorizontalIOS,
        headerTransparent: true,
      }}
    >
      <RestaurantsSettingsStack.Screen
        options={{
          header: () => null,
        }}
        name="Settings"
        component={RestaurantsSettingsScreen}
      />
      <RestaurantsSettingsStack.Screen name="Camera" component={CameraScreen} />
      <RestaurantsSettingsStack.Screen
        name="Printer"
        component={PrinterScreen}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="ChangeAddress"
        component={ChangeAddressScreen}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="Hours Screen"
        component={HoursScreen}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="Menu Screen"
        component={MenuScreen}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="Edit Menu Item"
        component={EditMenuItem}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="Restaurant Past Orders"
        component={RestaurantsPastOrders}
        options={{ title: "" }}
      />
      <RestaurantsSettingsStack.Screen
        name="ViewSingleOldOrder"
        component={ViewSingleOldOrder}
        options={{ title: "" }}
      />
    </RestaurantsSettingsStack.Navigator>
  );
};
