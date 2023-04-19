/* eslint-disable prettier/prettier */
import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, createContext, useEffect } from "react";
import { db } from "../../../App";
// import jwt from "jsonwebtoken";
// import Buffer from "buffer";
import { Buffer } from "@craftzdog/react-native-buffer";
// import { sign } from "react-native-pure-jwt";
import JWT from "expo-jwt";
import axios from "axios";
import { fromByteArray } from "react-native-quick-base64";

export const DeliveryContext = createContext();

export const DeliveryContextProvider = ({ children }) => {
  // const jwt = require("jsonwebtoken");

  // const accessKey = {
  ///////////REMOVED
  // };
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

  let key = Buffer.from(accessKey.signing_secret, "utf-8");

  // let tempKey = key.toString("base64");

  const headers = { algorithm: "HS256", header: { "dd-ver": "DD-JWT-V1" } };

  // console.log("data: ", data);
  console.log("key: ", key);
  // console.log("key: ", accessKey.signing_secret);
  // console.log("headers: ", headers);
  console.log("key data: ", typeof key);
  // let names = Object.getOwnPropertyNames(key);
  // console.log("key data: ", names);
  // console.log("key data: ", key[0]);

  // let tempArray = [];
  // for (let count = 0; count < 32; count++) {
  //   tempArray.push(key[count]);
  // }

  // console.log("TA", tempArray);
  // let usekey = fromByteArray(key);
  // console.log("usekey: ", usekey);

  const token = JWT.encode(
    data,

    // accessKey.signing_secret,
    key,
    headers
  );

  const decodedToken = JWT.decode(token, accessKey.signing_secret);

  console.log("DT", decodedToken);
  //need to add this
  // base64url.encode()

  console.log("token: ", token);

  const body = JSON.stringify({
    external_delivery_id: "D-12345",
    pickup_address: "901 Market Street 6th Floor San Francisco, CA 94103",
    pickup_business_name: "Wells Fargo SF Downtown",
    pickup_phone_number: "+16505555555",
    pickup_instructions: "Enter gate code 1234 on the callbox.",
    dropoff_address: "901 Market Street 6th Floor San Francisco, CA 94103",
    dropoff_business_name: "Wells Fargo SF Downtown",
    dropoff_phone_number: "+16505555555",
    dropoff_instructions: "Enter gate code 1234 on the callbox.",
    order_value: 1999,
  });

  // console.log("axios: ", axios);
  if (token && body) {
    // console.log("token: ", token);
    // console.log("body:", body);
    axios
      .post("https://openapi.doordash.com/drive/v2/deliveries", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  return (
    <DeliveryContext.Provider
      value={{
        token,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
