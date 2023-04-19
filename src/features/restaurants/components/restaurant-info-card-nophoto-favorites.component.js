/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { SvgXml } from "react-native-svg";
import { default as star } from "../../../../assets/star";
import { default as open } from "../../../../assets/open";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Favorite } from "../../../components/favorites/favorite.component";
import { Text } from "../../../components/typography/text.component";
import {
  Rating,
  Info,
  RestaurantCardCover,
  RestaurantCard,
  SectionEnd,
  Section,
  Address,
} from "./restaurant-info-card.styles";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { View } from "react-native";

export const RestaurantInfoCardNoPhotoFavorites = ({ restaurant = {} }) => {
  const { day, useTime } = useContext(RestaurantsContext);
  const [currentlyOpen, setCurrentlyOpen] = useState(false);

  useEffect(() => {
    if (typeof restaurant.hours === "undefined") {
      setCurrentlyOpen(false);
    }
    if (
      parseFloat(useTime) > parseFloat(restaurant.hours.substring(0, 4)) &&
      parseFloat(useTime) < parseFloat(restaurant.hours.substring(5, 9)) &&
      isOpen === true
    ) {
      setCurrentlyOpen(true);
    } else {
      setCurrentlyOpen(false);
    }
  }, [restaurant.hours, day, useTime, isOpen]);

  const {
    name = "Some Restaurant",
    icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png",

    photo = [
      "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
    ],
    address = "100 some random street",
    isOpen,
    rating = 5,
    username,
    menus,
  } = restaurant;

  const ratingArray = Array.from(new Array(Math.floor(rating)));

  return (
    <>
      <RestaurantCard elevation={2}>
        <Favorite restaurant={restaurant} />
        <Info>
          <Text variant="label">{name}</Text>
          <Section>
            <Rating>
              {ratingArray.map((value, index) => (
                <SvgXml
                  key={`star-${username}-${index}`}
                  xml={star}
                  height={20}
                  width={20}
                />
              ))}
            </Rating>
          </Section>
          <View>
            <Section>
              <Address>
                Area: {address}, {restaurant.city}{" "}
              </Address>
            </Section>
          </View>
          <Spacer>
            <Address>
              hours:{" "}
              {restaurant.hours.slice(0, 4) < 1200
                ? restaurant.hours.slice(0, 2) === "00"
                  ? `12:${restaurant.hours.slice(2, 4)} AM`
                  : `${restaurant.hours.slice(0, 2)}:${restaurant.hours.slice(
                      2,
                      4
                    )} AM`
                : `${
                    parseFloat(restaurant.hours.slice(0, 2)) % 12
                  }:${restaurant.hours.slice(2, 4)} PM`}{" "}
              -{" "}
              {restaurant.hours.slice(5, 9) < 1200
                ? restaurant.hours.slice(5, 7) === "00"
                  ? `12:${restaurant.hours.slice(7, 9)} AM`
                  : `${restaurant.hours.slice(5, 7)}:${restaurant.hours.slice(
                      7,
                      9
                    )} AM`
                : `${
                    parseFloat(restaurant.hours.slice(5, 7)) % 12
                  }:${restaurant.hours.slice(7, 9)} PM`}
            </Address>
          </Spacer>
          <SectionEnd
            style={{ position: "absolute", right: 18, bottom: 18 }}
          ></SectionEnd>
        </Info>
      </RestaurantCard>
    </>
  );
};
