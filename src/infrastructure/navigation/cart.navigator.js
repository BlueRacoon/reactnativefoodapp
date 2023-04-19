/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { CartScreen } from "../../features/cart/screens/cart.screen";
import { CartSuccessScreen } from "../../features/cart/screens/cart-success.screen";
import { CartErrorScreen } from "../../features/cart/screens/cart-error.screen";

const CartStack = createStackNavigator();

const createScreenOptions = ({ route }) => {
  return {
    headerShown: false,
  };
};

export const CartNavigator = () => {
  return (
    <CartStack.Navigator screenOptions={createScreenOptions} name="Cart">
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="CartSuccess" component={CartSuccessScreen} />
      <CartStack.Screen name="CartError" component={CartErrorScreen} />
    </CartStack.Navigator>
  );
};
