/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from "react";

import { SafeArea } from "../../../components/utils/safe-area.component";
import { Button, Divider, List } from "react-native-paper";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../infrastructure/theme/colors";
import { Alert, KeyboardAvoidingView, View, Platform } from "react-native";
import {
  ModifyItemTitle,
  OrderTitleContainer,
  AuthButton,
  AdminContainer,
  CreateButton,
} from "../../account/components/account.styles";
import { UpdateOrderStatus } from "../components/change-status.component";
import { CartContext } from "../../../services/cart/cart.context";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { OrdersContext } from "../../../services/orders/orders.context";

function allAreNull(arr) {
  if (!arr.length) {
    return false;
  }
  return true;
}

export const ViewSingleOldUserOrder = (props) => {
  const { clearCart, updateFromOldOrders } = useContext(CartContext);
  const { getOneRestaurant } = useContext(RestaurantsContext);
  const { liveOrder } = useContext(OrdersContext);
  const [tempStatus, setTempStatus] = useState("completed");
  const [refundValue, setRefundValue] = useState(0);

  // console.log(props.route.params.props.value);
  //this is to limit use of the settings screen options and prevent people with open order going to other rests and trying to navigate to cart/rest screen.
  // console.log("LO: ", liveOrder);
  useEffect(() => {
    // console.log(typeof liveOrder);
    // console.log(liveOrder.length);

    if (typeof liveOrder === "undefined" || liveOrder === null) {
      setTempStatus("completed");
    } else {
      if (liveOrder.length > 0 || typeof liveOrder.length === "undefined") {
        if (liveOrder.hasOwnProperty("value")) {
          setTempStatus(liveOrder.value.status);
        } else {
          setTempStatus("completed");
        }
      } else {
        setTempStatus("completed");
      }
    }
  }, [liveOrder]);

  useEffect(() => {
    if (props.route.params.props.value.refundData.length !== 0) {
      let tempValue = 0;
      for (let object of props.route.params.props.value.refundData) {
        tempValue = object.refundAmount + tempValue;
      }
      tempValue = parseFloat(tempValue) / 100;
      setRefundValue(tempValue);
      // console.log(tempValue);
    }
  }, []);

  const updateCartValues = async (res) => {
    return new Promise(async (resolve, reject) => {
      try {
        await clearCart(),
          await updateFromOldOrders(
            props.route.params.props.value.cart,
            res,
            props.route.params.props.value.menuSelected
          ),
          resolve(true);
      } catch (e) {
        resolve(false);
      }
    });
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView>
        <OrderTitleContainer>
          <Spacer size="small" />
          <ModifyItemTitle labelStyle={{ fontSize: 16 }} type="text">
            Order: {props.route.params.props.value.number}
          </ModifyItemTitle>
          <Spacer size="small" />
        </OrderTitleContainer>
        <ScrollView>
          <Spacer size="large" />
          <Spacer size="large" position="left">
            <Spacer size="large" position="right">
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontSize: 20 }}>
                    Customer: {props.route.params.props.value.customer}
                  </Text>
                  <Text style={{ fontSize: 20 }}>
                    Place: {props.route.params.props.value.restaurant}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20 }}>
                    Total:{" "}
                    {parseFloat(
                      props.route.params.props.value.stripeTotal / 100
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                  <Text style={{ fontSize: 20 }}>
                    Tip:{" "}
                    {parseFloat(
                      props.route.params.props.value.tip
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Text>
                </View>
              </View>
            </Spacer>
          </Spacer>
          {props.route.params.props.value.refundData.length !== 0 ? (
            <>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 15,
                }}
              >
                <Text variant="error" style={{ fontSize: 20 }}>
                  Refunded:{" "}
                  {parseFloat(refundValue).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </View>
            </>
          ) : null}
          <List.Section>
            {props.route.params.props.value.cart.map((item, i) => {
              return (
                <>
                  <TouchableOpacity onPress={() => null}>
                    <List.Item
                      key={`item-${i}`}
                      title={`${item.item}  ${parseFloat(
                        item.price / 100
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}`}
                      right={() => (
                        <Text style={{ paddingRight: 15, fontSize: 16 }}>
                          -
                        </Text>
                      )}
                    />

                    {allAreNull(item.modifiers) && (
                      <>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollInsdicator={false}
                          style={{ height: 30, paddingLeft: 25 }}
                        >
                          {item.modifiers.map((option) => {
                            {
                              /* console.log(option); */
                            }
                            if (!option) {
                              const key = option;
                              return;
                            } else {
                              const key = option;
                              return (
                                <Spacer position="left" size="small">
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: colors.brand.primary,
                                      borderRadius: 10,
                                      padding: 4,

                                      justifyContent: "center",
                                    }}
                                  >
                                    <Text
                                      variant="caption"
                                      style={{
                                        fontSize: 15,
                                        justifyContent: "center",
                                        color: "white",
                                      }}
                                    >
                                      {option}
                                    </Text>
                                  </TouchableOpacity>
                                </Spacer>
                              );
                            }
                          })}
                          <Spacer size="xl" position="right" />
                        </ScrollView>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              );
            })}
          </List.Section>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: 30,
          marginRight: 30,
          marginLeft: 30,
        }}
      >
        <Spacer size="large" />

        <AuthButton
          onPress={async () => {
            tempStatus === "completed"
              ? getOneRestaurant(
                  props.route.params.props.value.restaurant
                ).then(async (res) => {
                  if (
                    res.menuSelected !==
                    props.route.params.props.value.menuSelected
                  ) {
                    // console.log(props.route.params.props.value.menuSelected);
                    // console.log(props.route.params.props.value.number);
                    // console.log(res.menuSelected);
                    Alert.alert("Menu not available");
                  } else {
                    updateCartValues(res).then((promise) => {
                      if (promise === true) {
                        props.navigation.navigate("CartScreen");
                      } else {
                        Alert.alert("Error");
                      }
                    });
                  }
                })
              : Alert.alert("Current order must be completed");
          }}
          mode="contained"
        >
          Repeat Order
        </AuthButton>
        <Spacer size="large" />
      </View>
    </SafeArea>
  );
};
