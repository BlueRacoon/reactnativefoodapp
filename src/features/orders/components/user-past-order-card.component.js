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

export const UserPastOrderCard = (props) => {
  const [statusColor, setStatusColor] = useState("white");

  //   console.log(props.props.value.orderDate);
  //   useEffect(() => {
  //     if (props.props.value.status === "new") {
  //       setStatusColor("#BE1E2D99");
  //     } else {
  //       setStatusColor("white");
  //     }
  //   }, [props.props.value.status]);

  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("ViewSingleOldUserOrder", {
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
                  <Text
                    variant="label"
                    style={{ flexWrap: "wrap", maxWidth: 225 }}
                  >
                    {props.props.value.restaurant}
                  </Text>
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              <View style={{ justifyContent: "flex-start" }}>
                <Text>Date: {props.props.value.orderDate}</Text>
                <Text>Items: {props.props.value.cart.length}</Text>
              </View>
            </SwitchButtonContainer>
          </AdminContainer>
        </Info>
      </RestaurantCard>
    </TouchableOpacity>
  );
};
