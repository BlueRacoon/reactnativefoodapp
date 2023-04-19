/* eslint-disable prettier/prettier */
import React from "react";
import { OrdersScreen } from "../../features/orders/screens/orders.screen";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { ViewSingleOrder } from "../../features/orders/screens/view-single-order.screen";

const OrdersStack = createStackNavigator();

export const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <OrdersStack.Screen name="OrdersScreen" component={OrdersScreen} />
      <OrdersStack.Screen name="ViewSingleOrder" component={ViewSingleOrder} />
    </OrdersStack.Navigator>
  );
};
