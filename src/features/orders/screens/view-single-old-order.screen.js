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
import { refundRequest } from "../../../services/checkout/refund.service";
import { UpdateRefundDataOnOrder } from "../../../services/checkout/order.service";
import { CartPaymentProcessing } from "../../cart/components/cart.styles";
import { SalesContext } from "../../../services/sales/sales.context";

function allAreNull(arr) {
  if (!arr.length) {
    return false;
  }
  return true;
}

export const ViewSingleOldOrder = (props) => {
  const { updateSalesData } = useContext(SalesContext);
  const [localStatus, setLocalStatus] = useState(
    props.route.params.props.value.status
  );
  const [refundValue, setRefundValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  var b = new Date();
  b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
  let useDate = b.toISOString().slice(0, 10);

  // console.log(props.route.params.props.value.token);
  // console.log(props.route.params.props.value.total);

  let RefundItemAlert = () => {
    // console.log(restaurant);
    Alert.prompt(
      "Refunds",
      "Enter refund amount IE: 10.99",
      (number) => {
        // console.log("number entry: ", number);
        if (parseFloat(number) > props.route.params.props.value.total / 100) {
          Alert.alert("Input value greater than order total");
          return;
        }
        if (
          parseFloat(number) >
          props.route.params.props.value.total / 100 - refundValue
        ) {
          Alert.alert("Input value greater than balance");
          return;
        }
        setIsLoading(true);
        let tempNum = parseFloat(number * 100);
        // console.log(tempNum);
        try {
          refundRequest(
            props.route.params.props.value.paymentIntent,
            tempNum
          ).then((refundObject) => {
            if (typeof refundObject === "undefined") {
              setIsLoading(false);
              return;
            } else {
              UpdateRefundDataOnOrder(
                refundObject.id,
                refundObject.refund.amount,
                props.route.params.props.value.orderDate,
                props.route.params.props.value.number,
                props.route.params.props.value.email
              ).then(() => {
                UpdateLocalRefund(tempNum);
                updateSalesData();
                setIsLoading(false);
                return;
              });
            }
          });
        } catch (e) {
          setIsLoading(false);
        }
      },
      "plain-text",
      "",
      "numeric"
    );
  };

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

  const UpdateLocalRefund = (tempNum) => {
    let newTemp = tempNum / 100 + refundValue;
    setRefundValue(newTemp);
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView>
        <Spacer size="xl" />
        <Spacer size="large" />
        <OrderTitleContainer>
          <Spacer size="small" />
          <ModifyItemTitle labelStyle={{ fontSize: 16 }} type="text">
            Order: {props.route.params.props.value.number}
          </ModifyItemTitle>
          <Spacer size="small" />
        </OrderTitleContainer>
        {isLoading && (
          <View
            style={{
              zIndex: 999,
              justifyContent: "center",
              alignItems: "center",
              top: "50%",
            }}
          >
            <CartPaymentProcessing />
          </View>
        )}
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
                  <Text style={{ fontSize: 20 }}>Status: {localStatus}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20 }}>
                    Total:{" "}
                    {parseFloat(
                      props.route.params.props.value.total / 100
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
                  {"  "}
                  Balance Left:{" "}
                  {parseFloat(
                    props.route.params.props.value.total / 100 - refundValue
                  ).toLocaleString("en-US", {
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
        <AdminContainer>
          <CreateButton
            mode="contained"
            onPress={() => {
              try {
                RefundItemAlert();
              } catch (e) {
                setIsLoading(false);
              }
            }}
          >
            Refund
          </CreateButton>
          <CreateButton
            mode="contained"
            onPress={() => {
              null;
            }}
          >
            Print
          </CreateButton>
        </AdminContainer>

        {/* <AuthButton
          onPress={() => {
            null;
          }}
          mode="contained"
        >
          Print
        </AuthButton>
        <Spacer size="large" />
        <AuthButton
          onPress={() => {
            null;
          }}
          mode="contained"
        >
          Refund
        </AuthButton> */}
      </View>
    </SafeArea>
  );
};
