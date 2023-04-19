/* eslint-disable prettier/prettier */
import { CitiesContextProvider } from "../../services/cities/cities.context";
import { FavoritesContextProvider } from "../../services/favorites/favorites.context";
import { LocationContextProvider } from "../../services/location/location.context";
import { RestaurantsContextProvider } from "../../services/restaurants/restaurants.context";
import { AccountTypeNavigator } from "./accountType.navigator";
import { CartContextProvider } from "../../services/cart/cart.context";
import { RestaurantBackendContextProvider } from "../../services/restaurant-backend/restaurant-backend.context";
import { OrdersContextProvider } from "../../services/orders/orders.context";
import { SalesContextProvider } from "../../services/sales/sales.context";
import React from "react";
// import { DeliveryContextProvider } from "../../services/delivery/delivery.context";

export const AppNavigator = () => {
  return (
    <OrdersContextProvider>
      <FavoritesContextProvider>
        <LocationContextProvider>
          <RestaurantBackendContextProvider>
            <SalesContextProvider>
              <RestaurantsContextProvider>
                <CitiesContextProvider>
                  <CartContextProvider>
                    {/* <DeliveryContextProvider> */}
                    <AccountTypeNavigator />
                    {/* </DeliveryContextProvider> */}
                  </CartContextProvider>
                </CitiesContextProvider>
              </RestaurantsContextProvider>
            </SalesContextProvider>
          </RestaurantBackendContextProvider>
        </LocationContextProvider>
      </FavoritesContextProvider>
    </OrdersContextProvider>
  );
};
