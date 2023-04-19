/* eslint-disable prettier/prettier */
import React from "react";
import { RestaurantsScreen } from "../../features/restaurants/screens/restaurants.screen";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { RestaurantDetailScreen } from "../../features/restaurants/screens/restaurantsDetails.screen";
import { RestaurantItemScreen } from "../../features/restaurants/components/restaurant-item.component";

const RestaurantStack = createStackNavigator();

export const RestaurantsNavigator = () => {
  return (
    <RestaurantStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <RestaurantStack.Screen
        name="RestaurantsScreen"
        component={RestaurantsScreen}
      />
      <RestaurantStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
      />
      <RestaurantStack.Screen
        name="RestaurantItemScreen"
        component={RestaurantItemScreen}
      />
    </RestaurantStack.Navigator>
  );
};
