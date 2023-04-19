/* eslint-disable prettier/prettier */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import React, { useContext } from "react";
import { db } from "../../../App";

const getCount = async () => {
  const docRef = doc(db, "orders", "number");
  const docSnap = await getDoc(docRef);
  let total_count = docSnap.data().ordernumber;

  return total_count;
};

const getTodaysDate = async () => {
  var todayDate = new Date();
  todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());
  let useDate = todayDate.toISOString().slice(0, 10);
  return useDate;
};

const getFullDate = async () => {
  var tempDate = new Date();
  await tempDate.setMinutes(
    tempDate.getMinutes() - tempDate.getTimezoneOffset()
  );
  // console.log(tempDate);
  return tempDate;
};

const getCurrentTime = async () => {
  var todayDate = new Date();
  todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());
  var hours = todayDate.getUTCHours();
  var AmOrPm = hours >= 12 ? "pm" : "am";
  var minutes = todayDate.getMinutes();
  if (minutes < 10) {
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

export const AddOrder = async (
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
) => {
  //need to grab count since each order has a key of count
  let newCount = await getCount();
  // having issues getting correct date - hoping this works for est since cant pull context here
  let date = await getTodaysDate();
  let fullD = await getFullDate();
  let currentTime = await getCurrentTime();

  let tempRestTotal = amount - appyFee * 100;

  let order = {
    cart: cart,
    customer: name,
    stripeTotal: amount,
    total: tempRestTotal,
    token: token,
    restaurant: restName,
    number: newCount,
    createdAt: fullD,
    completedAt: fullD,
    status: "new",
    AMFee: appyFee,
    tip: calculatedTip,
    tax: totalTax,
    pickupChoice: pickupChoice,
    pickupTime: "",
    email: userEmail,
    restaurantEmail: restEmail,
    orderDate: date,
    orderTime: currentTime,
    readyTime: "",
    preparingTime: "",
    completedTime: "",
    restLoc: restLoc,
    restViewport: restViewport,
    menuSelected: menuSelected,
    refundData: [],
  };

  if (newCount) {
    try {
      const docRef = doc(db, "orders", date);
      setDoc(
        docRef,
        {
          [newCount]: order,
        },
        { merge: true }
      );

      // alert("Order created!");
    } catch (e) {
      //   console.log(e);
      alert("Please try again.");
    }
    try {
      const docRef = doc(db, "users", userEmail);
      setDoc(
        docRef,
        {
          [newCount]: order,
        },
        { merge: true }
      );

      // alert("Order created!");
    } catch (e) {
      alert("Please try again.");
    }
  }
};

export const UpdateNewOrder = (OrderInfo, paymentIntent) => {
  return new Promise(async (resolve, reject) => {
    // console.log("update new order triggered");

    let newCount = await getCount();
    let date = await getTodaysDate();

    let order = {
      orderInfo: OrderInfo,
      paymentIntent: paymentIntent,
    };

    if (newCount) {
      try {
        const docRef = doc(db, "orders", date);
        await setDoc(
          docRef,
          {
            [newCount]: order,
          },
          { merge: true }
        );
        resolve(newCount);
      } catch (e) {
        // alert("Please try again.");
        reject(false);
      }
    }
  });
};

export const updateCount = async () => {
  let newCount = await getCount();
  try {
    const docRef = doc(db, "orders", "number");
    setDoc(
      docRef,
      {
        ordernumber: newCount + 1,
      },
      { merge: true }
    );

    // alert("Order created!");
  } catch (e) {
    // alert("Please try again.");
  }
};

export const UpdateRefundDataOnOrder = (
  refundId,
  refundAmount,
  orderDate,
  orderID,
  userEmail
) => {
  return new Promise(async (resolve, reject) => {
    let order = {
      refundId: refundId,
      refundAmount: refundAmount,
    };

    try {
      const docRef = doc(db, "orders", orderDate);
      await setDoc(
        docRef,
        {
          [orderID]: {
            refundData: arrayUnion(order),
          },
        },
        { merge: true }
      );
    } catch (e) {
      console.log(e);
    }

    try {
      const docRef = doc(db, "users", userEmail);
      await setDoc(
        docRef,
        {
          [orderID]: {
            refundData: arrayUnion(order),
          },
        },
        { merge: true }
      );
      resolve(true);
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
};
