/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { Alert } from "react-native";
import { db } from "../../../../App";

const adjustTime = (hour, min) => {
  var hoursFixed = hour > 12 ? hour % 12 : hour;
  var AmOrPm = hour >= 12 ? "pm" : "am";
  if (min < 10) {
    var adjustedMinutes = `0${min}`;
    var finalTime = hoursFixed + ":" + adjustedMinutes + " " + AmOrPm;
    // let useDate = todayDate.toISOString().slice(11, 16);
    return finalTime;
  } else {
    var finalTime = hoursFixed + ":" + min + " " + AmOrPm;
    return finalTime;
  }
};

export const UpdatePickupTime = async (
  startHour,
  startMin,
  merge,
  orderNumber,
  today
) => {
  var adjustedTime = await adjustTime(startHour, startMin);

  const updateDoc = doc(db, "orders", today);

  try {
    setDoc(
      updateDoc,
      {
        [orderNumber]: {
          pickupTime: adjustedTime,
        },
      },

      { merge: true }
    );

    Alert.alert("Pickup time updated!");
  } catch (e) {
    Alert.alert("Please try again.");
  }
};
