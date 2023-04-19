/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { FavoritesContext } from "../../../services/favorites/favorites.context";
import { OrdersContext } from "../../../services/orders/orders.context";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { RestaurantInfoCardNoPhotoFavorites } from "../../restaurants/components/restaurant-info-card-nophoto-favorites.component";
import { RestaurantInfoCardNoPhoto } from "../../restaurants/components/restaurant-info-card-nophoto.component";
import { RestaurantInfoCard } from "../../restaurants/components/restaurant-info-card.component";

import { RestaurantList } from "../../restaurants/components/restaurant-list.styles";

const NoFavoritesArea = styled(SafeArea)`
  align-items: center;
  justify-content: center;
`;

export const FavoritesScreen = ({ navigation }) => {
  const { favorites } = useContext(FavoritesContext);
  const { liveOrder } = useContext(OrdersContext);
  const { getOneRestaurant } = useContext(RestaurantsContext);
  const [tempStatus, setTestStatus] = useState("completed");

  //this is to limit use of the settings screen options and prevent people with open order going to other rests and trying to navigate to cart/rest screen.
  useEffect(() => {
    // console.log(liveOrder.length);
    if (typeof liveOrder === "undefined" || liveOrder === null) {
      setTestStatus("completed");
    } else {
      if (liveOrder.hasOwnProperty("value")) {
        setTestStatus(liveOrder.value.status);
        // console.log(liveOrder);
        // setTestStatus("not complete");
      } else {
        setTestStatus("completed");
      }
    }
  }, [liveOrder]);

  return favorites.length ? (
    <SafeArea>
      <RestaurantList
        data={favorites}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                tempStatus === "completed"
                  ? getOneRestaurant(item.name).then((res) => {
                      navigation.navigate("RestaurantDetail", {
                        restaurant: res,
                      });
                    })
                  : Alert.alert("Current order must be completed")
              }
            >
              <Spacer position="bottom" size="large">
                <RestaurantInfoCardNoPhotoFavorites restaurant={item} />
              </Spacer>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{}}
      />
    </SafeArea>
  ) : (
    <NoFavoritesArea>
      <Text center>No favorites yet!</Text>
    </NoFavoritesArea>
  );
};
