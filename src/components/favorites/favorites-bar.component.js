/* eslint-disable prettier/prettier */
import React from "react";
import styled from "styled-components/native";
import { ScrollView, View, TouchableOpacity } from "react-native";

import { CompactRestaurantInfo } from "../restaurant/Compact-restaurant-info.component";
import { Spacer } from "../spacer/spacer.component";
import { Card } from "react-native-paper";
import { Text } from "../typography/text.component";

const FavoritesWrapper = styled.View`
  padding: 10px;
  z-index: 999;
  border-radius: 15px;
`;

export const FavoritesBar = ({ favorites, onNavigate }) => {
  if (!favorites.length) {
    return (
      <FavoritesWrapper>
        <Spacer variant="left.large">
          <Text variant="caption">Like a restaurant to save here!</Text>
        </Spacer>
      </FavoritesWrapper>
    );
  } else {
    return (
      <FavoritesWrapper>
        <Spacer variant="left.large">
          <Text variant="caption">Favorites</Text>
        </Spacer>
        <ScrollView horizontal showsHorizontalScrollInsdicator={false}>
          {favorites.map((restaurant) => {
            const key = restaurant.name;
            return (
              <Spacer key={key} position="left" size="medium">
                <TouchableOpacity
                  onPress={() =>
                    onNavigate("RestaurantDetail", {
                      restaurant,
                    })
                  }
                >
                  <CompactRestaurantInfo restaurant={restaurant} />
                </TouchableOpacity>
              </Spacer>
            );
          })}
        </ScrollView>
      </FavoritesWrapper>
    );
  }
};
