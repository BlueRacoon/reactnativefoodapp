/* eslint-disable prettier/prettier */

import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { Alert } from "react-native";
import { db } from "../../../../App";

export const UpdateRestaurantStatus = async (restName, status) => {
  try {
    const docRef = doc(db, "restaurants", restName);
    await setDoc(
      docRef,
      {
        isOpen: status,
      },
      { merge: true }
    ).then(() => {
      var temp = status === true ? "OPEN" : "CLOSED";
      Alert.alert(`Status changed to: ${temp}`);
    });
  } catch (e) {
    //   console.log(e);
    Alert.alert("Please try again.");
  }
};
