/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { SettingsAdminScreen } from "../../features/settings/screens/settings-admin.screen";
import { CameraScreen } from "../../features/settings/screens/camera.screens";
import { OrdersContext } from "../../services/orders/orders.context";
import { AdminPastOrders } from "../../features/settings/screens/admin-past-orders.screen";
import { ViewSingleOldOrder } from "../../features/orders/screens/view-single-old-order.screen";

const SettingsAdminStack = createStackNavigator();

export const SettingsAdminNavigator = ({ route, navigation }) => {
  return (
    <SettingsAdminStack.Navigator
      screenOptions={{
        headerShown: "screen",
        CardStyleInterpolators: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <SettingsAdminStack.Screen
        options={{
          header: () => null,
        }}
        name="Settings"
        component={SettingsAdminScreen}
      />
      <SettingsAdminStack.Screen name="Camera" component={CameraScreen} />
      <SettingsAdminStack.Screen
        name="Camera Screen"
        component={CameraScreen}
        options={{ title: "" }}
      />
      <SettingsAdminStack.Screen
        name="AdminPastOrders"
        component={AdminPastOrders}
        options={{ title: "" }}
      />
      <SettingsAdminStack.Screen
        name="ViewSingleOldOrder"
        component={ViewSingleOldOrder}
      />
    </SettingsAdminStack.Navigator>
  );
};
