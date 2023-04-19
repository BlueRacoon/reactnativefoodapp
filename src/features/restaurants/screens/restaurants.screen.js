/* eslint-disable prettier/prettier */
import styled from "styled-components/native";
import React, { useContext, useEffect, useState } from "react";
import { RefreshControl, TouchableOpacity } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import { RestaurantInfoCard } from "../components/restaurant-info-card.component";
import { FavoritesBar } from "../../../components/favorites/favorites-bar.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { FadeInView } from "../../../components/animations/fade.animation";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { FavoritesContext } from "../../../services/favorites/favorites.context";
import { Search } from "../components/search.component.js";
import { RestaurantList } from "../components/restaurant-list.styles";
import { Text } from "../../../components/typography/text.component";

import { ChooseCities } from "../components/cities.component";
import { CitiesContext } from "../../../services/cities/cities.context";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { colors } from "../../../infrastructure/theme/colors";
import {
  Loading,
  LoadingContainer,
} from "../../account/components/account.styles";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const RestaurantsScreen = ({ navigation }) => {
  const { isLoading, restList, retrieveRestaurants } =
    useContext(RestaurantsContext);
  const { favorites } = useContext(FavoritesContext);
  const { citiesList } = useContext(CitiesContext);
  const [isToggled, setIsToggled] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // console.log(restList[2]);
  // console.log("restlist length in rest screen", restList.length);

  const onRefresh = async () => {
    setIsFetching(true);
    await retrieveRestaurants();
    await sleep(2000);
    setIsFetching(false);
  };

  return (
    <SafeArea>
      {isLoading && (
        <LoadingContainer>
          <Loading animating={true} color={Colors.blue300} size={50} />
        </LoadingContainer>
      )}
      <Search
        isFavoritesToggled={isToggled}
        onFavoritesToggled={() => setIsToggled(!isToggled)}
      />
      {isToggled && (
        <FavoritesBar favorites={favorites} onNavigate={navigation.navigate} />
      )}

      {citiesList && <ChooseCities cityData={citiesList} />}

      <RestaurantList
        data={restList}
        // refreshing={isFetching}
        // onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            title="Finding tasty places to eat..."
            tintColor={colors.brand.primary}
            titleColor={colors.brand.primary}
          />
        }
        renderItem={({ item }) => {
          return (
            <>
              {item.isShowing && (
                <>
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                      navigation.navigate("RestaurantDetail", {
                        restaurant: item,
                      });
                    }}
                  >
                    <Spacer position="bottom" size="large">
                      <FadeInView>
                        <RestaurantInfoCard restaurant={item} />
                      </FadeInView>
                    </Spacer>
                  </TouchableOpacity>
                </>
              )}
            </>
          );
        }}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{}}
      />
    </SafeArea>
  );
};
