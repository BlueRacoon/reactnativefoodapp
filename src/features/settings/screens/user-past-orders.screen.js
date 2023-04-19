/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { OrdersContext } from "../../../services/orders/orders.context";
import { AdminButton } from "../../account/components/account.styles";
import { PaymentProcessing } from "../../cart/components/cart.styles";
import { UserPastOrderCard } from "../../orders/components/user-past-order-card.component";

export const UserPastOrders = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const { oldUserOrders, getOldUserOrders, isLoading } =
    useContext(OrdersContext);

  // console.log(user.email);

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    getOldUserOrders(user.email);
  }, []);

  // useEffect(() => {
  //   console.log("THIS IS FIRST ORDER:", oldUserOrders[0]);
  // }, [oldUserOrders]);

  function allAreNull(arr) {
    if (!arr.length) {
      return false;
    }
    return true;
  }

  return (
    <SafeArea>
      <View
        style={{ justifyContent: "center", alignItems: "center", zIndex: 150 }}
      >
        <Spacer size="large" />
        <AdminButton
          onPress={() => {
            if (user.email) {
              getOldUserOrders(user.email);
            } else {
              alert("Please choose a date");
            }
          }}
          mode="contained"
        >
          Refresh
        </AdminButton>
      </View>
      <Spacer size="large" />
      {isLoading && (
        <>
          <PaymentProcessing />
        </>
      )}
      {oldUserOrders.length === 0 && !isLoading && (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "60%",
            }}
          >
            <Text>No orders!</Text>
          </View>
        </>
      )}
      <View
        style={{
          zIndex: 0,
        }}
      >
        {oldUserOrders && (
          <>
            <ScrollView
              style={{
                height: height - 275,
                width: width,
                padding: 10,
                zIndex: 90,
              }}
            >
              {Object.keys(oldUserOrders).map((item, i) => {
                return (
                  <>
                    <UserPastOrderCard
                      props={oldUserOrders[item]}
                      navigation={navigation}
                      // today={valueMenusItem}
                    />
                    <Spacer size="large" />
                  </>
                );
              })}
              <Spacer size="large" />
            </ScrollView>
          </>
        )}
      </View>
    </SafeArea>
  );
};
