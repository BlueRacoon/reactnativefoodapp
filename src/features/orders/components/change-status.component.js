/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { Alert } from "react-native";
import { db } from "../../../../App";

const getCurrentTime = async () => {
  var todayDate = new Date();
  todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());
  var hours = todayDate.getUTCHours();
  var AmOrPm = hours >= 12 ? "pm" : "am";
  var hoursFixed = hours > 12 ? hours % 12 : hours;
  var minutes = todayDate.getMinutes();
  if (minutes.length <= 1) {
    var adjustedMinutes = `0${minutes}`;
    var hoursFixed = hours > 12 ? hours % 12 : hours;
    var finalTime = hoursFixed + ":" + adjustedMinutes + " " + AmOrPm;
    // let useDate = todayDate.toISOString().slice(11, 16);
    return finalTime;
  } else {
    var hoursFixed = hours > 12 ? hours % 12 : hours;
    var finalTime = hoursFixed + ":" + minutes + " " + AmOrPm;
    return finalTime;
  }
};

const getCurrentFullTime = async () => {
  var todayDate = new Date();
  await todayDate.setMinutes(
    todayDate.getMinutes() - todayDate.getTimezoneOffset()
  );
  return todayDate;
};

export const UpdateOrderStatus = async (status, merge, orderNumber, today) => {
  var statusTime = `${status}Time`;
  var time = await getCurrentTime();
  var fullTime = await getCurrentFullTime();
  let fullTimeName = `${status}FullTime`;
  // console.log(time);
  const updateDoc = doc(db, "orders", today);

  try {
    setDoc(
      updateDoc,
      {
        [orderNumber]: {
          status: status,
        },
      },

      { merge: true }
    );

    // alert("Status updated!");
  } catch (e) {
    alert("Please try again.");
  }

  try {
    // console.log("triggered fulltime add update");
    setDoc(
      updateDoc,
      {
        [orderNumber]: {
          [statusTime]: time,
          [fullTimeName]: fullTime,
        },
      },

      { merge: true }
    );

    Alert.alert("Status updated!");
  } catch (e) {
    Alert.alert("Please try again.");
  }
};
