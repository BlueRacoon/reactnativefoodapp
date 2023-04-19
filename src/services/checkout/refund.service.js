/* eslint-disable prettier/prettier */
import { host } from "../../utils/env";
import React from "react";
import { Alert } from "react-native";

export const refundRequest = (paymentIntent, amount) => {
  // console.log("paymentIntent", paymentIntent);
  // console.log("amount", amount);

  return fetch(`${host}/refund`, {
    body: JSON.stringify({
      paymentIntent,
      amount,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      Alert.alert(
        "Issue with refund. Please try again or refresh to check order balance."
      );
      return;
    }

    Alert.alert("Refund complete");
    return res.json();
  });
};
