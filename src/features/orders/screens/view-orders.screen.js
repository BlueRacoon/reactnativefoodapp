/* eslint-disable prettier/prettier */
import React from "react";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { useContext, useState, useEffect } from "react";
import { OrdersContext } from "../../../services/orders/orders.context";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import {
  AdminContainer,
  ButtonContainer,
  CartFullContainer,
  DropDownContainer,
  MenuItemBackground,
  MenuItemContainer,
  MenuItemContainerName,
  MenuItemDropDownContainer,
  MenuItemText,
  MenuItemTitleContainer,
  MenuTitleContainer,
  ModifyItemTitle,
  RawWarningMenuItemText,
  OrderTitleContainer,
  Title,
} from "../../account/components/account.styles";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { Spacer } from "../../../components/spacer/spacer.component";
import StepIndicator from "react-native-step-indicator";

const { width, height } = Dimensions.get("window");

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#BF1F2E",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#BF1F2E",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#BF1F2E",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#BF1F2E",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#BF1F2E",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#BF1F2E",
};

export const ViewOrdersScreen = () => {
  const { liveOrder } = useContext(OrdersContext);
  const [currentPosition, setCurrentPostiion] = useState(2);

  // // console.log(orderData[0].dateTime);
  // console.log(liveOrder.value.number);

  const orderData = [
    {
      label: "New Order",
      orderStatus:
        "Your order has been placed. Please wait for confirmation & pickup time",
      value: "orderTime",
    },
    {
      label: "Order confirmed",
      orderStatus: "The restaurant is preparing your order",
      value: "preparingTime",
    },
    {
      label: "Estimated Pickup",
      orderStatus: "Waiting for pickup time",
      value: "preparingTime",
    },
    {
      label: "Order Ready",
      orderStatus: "Your order is ready for pickup",
      value: "readyTime",
    },
    {
      label: "Order complete",
      orderStatus: "Enjoy your order!",
      value: "completedTime",
    },
  ];
  const labels = [
    "Cart",
    "Delivery Address",
    "Order Summary",
    "Payment Method",
    "Track",
  ];

  useEffect(() => {
    if (liveOrder.value.status === "new") {
      setCurrentPostiion(1);
    }
    if (liveOrder.value.status === "confirmed") {
      setCurrentPostiion(2);
    }
    if (liveOrder.value.status === "preparing") {
      setCurrentPostiion(3);
    }
    if (liveOrder.value.status === "ready") {
      setCurrentPostiion(4);
    }
    if (liveOrder.value.status === "completed") {
      setCurrentPostiion(5);
    }
  }, [liveOrder]);

  console.disableYellowBox = true;
  return (
    <View>
      <OrderTitleContainer>
        <Spacer size="xl" />
        <ModifyItemTitle labelStyle={{ fontSize: 16 }} type="text">
          Order Progress
        </ModifyItemTitle>
        <Spacer size="small" />
      </OrderTitleContainer>
      <StatusBar backgroundColor="#000" barStyle="light-content" stye />
      {/* <Spacer size="large" /> */}
      {/* <Spacer size="small" /> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 0,
          height: "100%",
          paddingTop: height * 0.03,
          paddingBottom: height * 0.3,
        }}
      >
        <View
          style={{
            marginTop: 0,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: width * 0.95,
            elevation: 10,
            borderRadius: 20,
            backgroundColor: "white",
          }}
        >
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={orderData}
            direction="vertical"
            renderLabel={({ position, stepStatus, label, currentPosition }) => {
              return (
                <View
                  style={{
                    marginTop: 30,
                    paddingLeft: 5,
                    width: width - 100,
                    padding: 10,
                  }}
                >
                  {position === 0 && (
                    <>
                      {orderData[position].label && (
                        <>
                          <Text
                            style={{
                              fontSize: 17,
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {orderData[position].label}: #
                            {liveOrder.value.number}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {position !== 0 && (
                    <>
                      {orderData[position].label && (
                        <>
                          <Text
                            style={{
                              fontSize: 17,
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {orderData[position].label}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {position === 2 && (
                    <>
                      {orderData[position].orderStatus &&
                        liveOrder.value.pickupTime !== "" && (
                          <>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={{ fontSize: 15, color: "gray" }}>
                                Pickup time has been set for:{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: "black",
                                  fontWeight: 1000,
                                }}
                              >
                                {liveOrder.value.pickupTime}
                              </Text>
                            </View>
                          </>
                        )}
                      {orderData[position].orderStatus &&
                        liveOrder.value.pickupTime === "" && (
                          <>
                            <Text style={{ fontSize: 15, color: "gray" }}>
                              Waiting for pickup time...
                            </Text>
                          </>
                        )}
                    </>
                  )}
                  {position !== 2 && (
                    <>
                      {orderData[position].orderStatus && (
                        <>
                          <Text style={{ fontSize: 15, color: "gray" }}>
                            {orderData[position].orderStatus}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {orderData[position].value &&
                    liveOrder.value[orderData[position].value] !==
                      "undefined" && (
                      <>
                        <Text style={{ fontSize: 15, color: "lightgray" }}>
                          {/* {orderData[position].dateTime} */}
                          {liveOrder.value[orderData[position].value]}
                        </Text>
                      </>
                    )}
                </View>
              );
            }}
          />
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={async () => {
              // console.log(await getCurrentTime());
              null;
            }}
          >
            <Text style={{ fontSize: 18 }}></Text>
          </TouchableOpacity>
          <Spacer size="small" />
        </View>
      </View>
    </View>
  );
};
