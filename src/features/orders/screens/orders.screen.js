/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { OrdersContext } from "../../../services/orders/orders.context";
import {
  AuthButton,
  AdminButton,
  AdminContainer,
} from "../../account/components/account.styles";
import { OrderCard } from "../../orders/components/order-info-card.styles";
import { View, StatusBar, Dimensions } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Divider, List, Switch, Card } from "react-native-paper";
import {
  MenuName,
  RestaurantCard,
  Info,
  Section,
  SwitchButtonContainer,
} from "../../restaurants/components/restaurant-info-card.styles";
import { RestaurantOrderCard } from "../components/restaurant-order-card.component";
import { OffOnButton } from "../components/off-on-button-component";
import { RestaurantBackendContext } from "../../../services/restaurant-backend/restaurant-backend.context";
import styled from "styled-components/native";
import { Audio } from "expo-av";

let { width, height } = Dimensions.get("window");
const aspectRatio = height / width;

export const OrdersScreen = ({ navigation }) => {
  const { localData, day } = useContext(RestaurantBackendContext);
  const { liveOrder, getOrders } = useContext(OrdersContext);
  const { today } = useContext(OrdersContext);
  const [statusColor, SetStatusColor] = useState("white");
  const [sortedOrders, SetSortedOrders] = useState(null);

  function allAreNull(arr) {
    if (!arr.length) {
      return false;
    }
    return true;
  }

  const TopCard = styled(Card)`
    width: 95%;
    height: 15%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: center;
  `;

  const TopCardContainer = styled.View`
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: center;
  `;

  const BottomIndividualContainers = styled.View`
    width: 32%;
    justif-content: center;
    align-items: center;
  `;

  return (
    <SafeArea>
      <Spacer size="small" />
      <TopCard elevation={5}>
        <TopCardContainer>
          <BottomIndividualContainers>
            <Text style={{ fontSize: 20 }}>Today</Text>
            <Text style={{ fontSize: 20 }}>{today}</Text>
          </BottomIndividualContainers>
          <Divider style={{ width: 0.5, height: "90%" }} />
          <BottomIndividualContainers>
            <Text style={{ fontSize: 20 }}>Hours</Text>
            {typeof localData.hours !== "undefined" && (
              <>
                {localData.hours[day].time !== "" ? (
                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 20 }}>
                      {/* {localData.hours[day].time} */}
                      {localData.hours[day].time.slice(0, 4) < 1200
                        ? localData.hours[day].time.slice(0, 2) === "00"
                          ? `12:${localData.hours[day].time.slice(2, 4)} AM`
                          : `${localData.hours[day].time.slice(
                              0,
                              2
                            )}:${localData.hours[day].time.slice(2, 4)} AM`
                        : `${
                            parseFloat(localData.hours[day].time.slice(0, 2)) %
                            12
                          }:${localData.hours[day].time.slice(2, 4)} PM`}{" "}
                      {localData.hours[day].time.slice(5, 9) < 1200
                        ? localData.hours[day].time.slice(5, 7) === "00"
                          ? `12:${localData.hours[day].time.slice(7, 9)} AM`
                          : `${localData.hours[day].time.slice(
                              5,
                              7
                            )}:${localData.hours[day].time.slice(7, 9)} AM`
                        : `${
                            parseFloat(localData.hours[day].time.slice(5, 7)) %
                            12
                          }:${localData.hours[day].time.slice(7, 9)} PM`}{" "}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={{ fontSize: 20 }}>No hours</Text>
                  </>
                )}
              </>
            )}
            {typeof localData.hours === "undefined" && (
              <>
                <Text style={{ fontSize: 20 }}>No hours</Text>
              </>
            )}
          </BottomIndividualContainers>
          <Divider style={{ width: 0.5, height: "90%" }} />
          <BottomIndividualContainers style={{ paddingLeft: "15%" }}>
            <OffOnButton />
          </BottomIndividualContainers>
        </TopCardContainer>
      </TopCard>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spacer size="xl" />
        <AdminButton
          onPress={() => {
            getOrders(today);
          }}
          mode="contained"
        >
          Refresh
        </AdminButton>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <Spacer size="large" />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {liveOrder && (
          <>
            <ScrollView
              style={{
                height: (height - aspectRatio * height * 0.0475) * 0.75,
                width: width,
                padding: 10,
              }}
            >
              {Object.keys(liveOrder).map((item, i) => {
                return (
                  <>
                    <RestaurantOrderCard
                      props={liveOrder[item]}
                      navigation={navigation}
                      today={today}
                    />
                    <Spacer size="large" />
                  </>
                );
              })}
              <Spacer size="xxl" />
            </ScrollView>
          </>
        )}
      </View>
    </SafeArea>
  );
};
