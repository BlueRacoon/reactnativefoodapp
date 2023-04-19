/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect } from "react";
import { Text } from "../../../components/typography/text.component";
import { AdminContainer } from "../../account/components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Divider, List } from "react-native-paper";
import { View } from "react-native";
import {
  RestaurantCard,
  Info,
  Section,
  SwitchButtonContainer,
} from "../../restaurants/components/restaurant-info-card.styles";
import { colors } from "../../../infrastructure/theme/colors";

export const RestaurantOrderCard = (props) => {
  const [statusColor, setStatusColor] = useState("white");
  // console.log(props.navigation);

  useEffect(() => {
    // console.log(props.props.value.number, props.props.value.status);
    if (props.props.value.status === "new") {
      // ("triggered color");
      setStatusColor("#BE1E2D80");
    } else if (props.props.value.status === "preparing") {
      setStatusColor("#FFFF80");
    } else if (props.props.value.status === "ready") {
      setStatusColor("#B3FFB3");
    } else {
      // console.log("triggered white");
      setStatusColor("white");
    }
  }, [props.props.value.status, props]);

  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("ViewSingleOrder", {
          props: props.props,
        })
      }
    >
      <RestaurantCard
        elevation={3}
        style={{
          width: "100%",
          borderRadius: 20,
          backgroundColor: statusColor,
        }}
      >
        <Info>
          <AdminContainer>
            <SwitchButtonContainer>
              <Spacer size="small" />
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Order Number: {props.props.value.number}
              </Text>

              <Section>
                <Spacer size="small">
                  <Text variant="label" style={{ flexWrap: "wrap" }}>
                    {props.props.value.pickupTime !== "" && (
                      <>
                        <Text variant="label" style={{ flexWrap: "wrap" }}>
                          Pickup Time: {props.props.value.pickupTime}
                        </Text>
                      </>
                    )}
                    {props.props.value.pickupTime === "" && (
                      <>
                        <Text variant="label" style={{ flexWrap: "wrap" }}>
                          Method: {props.props.value.pickupChoice}
                        </Text>
                      </>
                    )}
                  </Text>
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              <View style={{ justifyContent: "flex-start" }}>
                <Text>Status: {props.props.value.status}</Text>
                <Text>Items: {props.props.value.cart.length}</Text>
              </View>
            </SwitchButtonContainer>
          </AdminContainer>
        </Info>
      </RestaurantCard>
    </TouchableOpacity>
  );
};
