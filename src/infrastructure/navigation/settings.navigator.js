/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { SettingsScreen } from "../../features/settings/screens/settings.screen";
import { FavoritesScreen } from "../../features/settings/screens/favorites.screen";
import { CameraScreen } from "../../features/settings/screens/camera.screens";
import { UserPastOrders } from "../../features/settings/screens/user-past-orders.screen";
import { ViewSingleOldUserOrder } from "../../features/orders/screens/view-single-old-user-order.screen";
import { OrdersContext } from "../../services/orders/orders.context";

const SettingsStack = createStackNavigator();

export const SettingsNavigator = ({ route, navigation }) => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: "screen",
        CardStyleInterpolators: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <SettingsStack.Screen
        options={{
          header: () => null,
        }}
        name="Settings"
        component={SettingsScreen}
      />
      <SettingsStack.Screen name="Favorites" component={FavoritesScreen} />
      <SettingsStack.Screen name="Camera" component={CameraScreen} />
      <SettingsStack.Screen
        name="UserPastOrders"
        component={UserPastOrders}
        options={{
          title: "",
        }}
      />
      <SettingsStack.Screen
        name="ViewSingleOldUserOrder"
        component={ViewSingleOldUserOrder}
        options={{ title: "" }}
      />
    </SettingsStack.Navigator>
  );
};
