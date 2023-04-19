/* eslint-disable prettier/prettier */

import createStripe from "stripe-client";
import { host } from "../../utils/env";
import React from "react";
import { AddOrder } from "./order.service";
import { Buffer } from "@craftzdog/react-native-buffer";

const accessKey = {
  ///////////REMOVED
};

const data = {
  aud: "doordash",
  iss: accessKey.developer_id,
  kid: accessKey.key_id,
  exp: Math.floor(Date.now() / 1000 + 60),
  iat: Math.floor(Date.now() / 1000),
};

// let key = Buffer.from(accessKey.signing_secret, "utf-8");

// const headers = { algorithm: "HS256", header: { "dd-ver": "DD-JWT-V1" } };

export const testDelivery = (data) => {
  return fetch(`${host}/testDelivery`, {
    body: JSON.stringify({
      data,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      // let temp = JSON.stringify(res);
      // console.log(temp);
      console.log("res status: ", res.status);
      return Promise.reject("something went wrong processing your delivery");
    }

    // dataRequest();

    return res.json();
  });
};

export const getDeliveryStatus = (deliveryID) => {
  console.log("delivery status triggered");

  return fetch(`${host}/getDeliveryStatus`, {
    body: JSON.stringify({
      deliveryID,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      console.log("res status: ", res.status);
      return Promise.reject("something went wrong processing your delivery");
    }

    return res.json();
  });
};

export const getDeliveryQuote = (id, userAddress, restAddress) => {
  return fetch(`${host}/getDeliveryQuote`, {
    body: JSON.stringify({
      id,
      userAddress,
      restAddress,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      console.log("res status: ", res.status);
      return Promise.reject("something went wrong processing your delivery");
    }

    // dataRequest();

    return res.json();
  });
};
