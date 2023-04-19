/* eslint-disable prettier/prettier */
import React, { useState, useContext, useRef, useMemo, useEffect } from "react";
import { List, Divider } from "react-native-paper";
import { Dimensions, ScrollView, View } from "react-native";
import { RestaurantInfoCard } from "../components/restaurant-info-card.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { OrderButton } from "../components/restaurant-list.styles";
import { CartContext } from "../../../services/cart/cart.context";
import { RestaurantInfoCardNoPhoto } from "../components/restaurant-info-card-nophoto.component";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { RestaurantDetailComponent } from "../components/restaurant-detail-component";
import { Text } from "../../../components/typography/text.component";
import {
  MenuCategoryCard,
  RestaurantCard,
} from "../components/restaurant-info-card.styles";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import {
  AdminContainer,
  ComingSoonView,
  CreateButton,
  DetailButton,
} from "../../account/components/account.styles";
import { colors } from "../../../infrastructure/theme/colors";
import { RestaurantDetailSpecialComponent } from "../components/restaurant-detail-special-component";

const { width, height } = Dimensions.get("window");

export const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const { day, useTime } = useContext(RestaurantsContext);
  const [screenToggle, setScreenToggle] = useState("menu");
  const [currentlyOpen, setCurrentlyOpen] = useState("menu");

  useEffect(() => {
    if (typeof restaurant.hours === "undefined") {
      setCurrentlyOpen(false);
    }
    if (
      parseFloat(useTime) > parseFloat(restaurant.hours.substring(0, 4)) &&
      parseFloat(useTime) < parseFloat(restaurant.hours.substring(5, 9)) &&
      restaurant.isOpen === true
    ) {
      setCurrentlyOpen(true);
    } else {
      setCurrentlyOpen(false);
    }
  }, [restaurant.hours, day, useTime, restaurant.isOpen]);

  return (
    <SafeArea style={{ height: "100%" }}>
      <Spacer size="large" />
      <Spacer size="small" />
      <RestaurantInfoCardNoPhoto restaurant={restaurant} />
      <Spacer size="large" />
      <Spacer size="large" />
      <AdminContainer>
        <CreateButton
          mode="contained"
          onPress={() => {
            setScreenToggle("reservation");
          }}
        >
          <Text style={{ color: "white" }}> Reservation </Text>
        </CreateButton>
        <Spacer size="large" position="right" />
        <CreateButton
          mode="contained"
          onPress={() => {
            setScreenToggle("menu");
          }}
        >
          <Text style={{ color: "white" }}> To-go </Text>
        </CreateButton>
      </AdminContainer>

      <Spacer size="large" />
      <Spacer size="small" />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {restaurant.hasOwnProperty("menuSelected") && (
          <>
            <Text style={{ fontSize: 26, color: "black", fontWeight: 500 }}>
              MENU : {restaurant.menuSelected.toUpperCase()}
            </Text>
          </>
        )}
      </View>
      <Spacer size="large" />
      <Spacer size="small" />

      {screenToggle === "menu" && (
        <>
          <RestaurantCard
            elevation={2}
            style={{ marginTop: 0, paddingTop: 0, borderRadius: 5 }}
          >
            <ScrollView
              style={{
                marginTop: 0,
                paddingTop: 0,
                overflow: true,
                maxHeight: height * 0.45,
                borderRadius: 5,
              }}
            >
              {restaurant.menus.hasOwnProperty("specials") && (
                <>
                  <RestaurantDetailSpecialComponent
                    {...restaurant.menus.specials}
                    key={"specials"}
                    catName="specials"
                    rest={restaurant}
                    navigation={navigation}
                    currentlyOpen={currentlyOpen}
                    properties={restaurant.menus.properties}
                  />
                </>
              )}

              {restaurant.menus && (
                <>
                  {Object.keys(restaurant.menus).map((r, index) => (
                    <>
                      <RestaurantDetailComponent
                        {...restaurant.menus[r]}
                        key={index}
                        catName={r}
                        rest={restaurant}
                        navigation={navigation}
                        currentlyOpen={currentlyOpen}
                        properties={restaurant.menus.properties}
                      />
                    </>
                  ))}
                </>
              )}
              <Divider />
            </ScrollView>
          </RestaurantCard>
        </>
      )}
      {screenToggle === "reservation" && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "60%",
          }}
        >
          <Text style={{ fontSize: 25, color: colors.brand.primary }}>
            Coming soon!
          </Text>
        </View>
      )}
    </SafeArea>
  );
};
