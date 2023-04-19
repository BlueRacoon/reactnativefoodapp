/* eslint-disable prettier/prettier */

import createStripe from "stripe-client";
import { host } from "../../utils/env";
import React from "react";
import { AddOrder } from "./order.service";
import axios from "axios";

///////////REMOVED
const stripe = createStripe("REMOVED");

export const cardTokenRequest = (card) => stripe.createToken({ card });

export const payRequest = (
  token,
  amount,
  name,
  restName,
  cart,
  appyFee,
  calculatedTip,
  totalTax,
  pickupChoice,
  userEmail,
  restEmail,
  restLoc,
  restViewport,
  menuSelected
) => {
  // console.log(token);
  // console.log(name);
  // console.log(amount);
  return fetch(`${host}/pay`, {
    body: JSON.stringify({
      token,
      name,
      amount,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      // let temp = JSON.stringify(res);
      // console.log(temp);
      return Promise.reject("something went wrong processing your payment");
    }

    // dataRequest();

    AddOrder(
      name,
      amount,
      token,
      restName,
      cart,
      appyFee,
      calculatedTip,
      totalTax,
      pickupChoice,
      userEmail,
      restEmail,
      restLoc,
      restViewport,
      menuSelected
    );

    return res.json();
  });
};
