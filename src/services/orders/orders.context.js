/* eslint-disable prettier/prettier */
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from "react";
import { db } from "../../../App";
import { AuthenticationContext } from "../authentication/authentication.context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const OrdersContext = createContext();

export const OrdersContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [oldOrders, setOldOrders] = useState([]);
  const [oldUserOrders, setOldUserOrders] = useState([]);
  const [liveOrder, setliveOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [today, setToday] = useState(Date());
  const [fullDate, setFullDate] = useState(Date());
  const { user, accountType } = useContext(AuthenticationContext);
  const [account, setAccount] = useState(accountType);

  const orderStatus = useRef(liveOrder);

  const loadAccountType = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(`@accountType-${uid}`);

      if (value !== null) {
        setAccount(JSON.parse(value));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (user && user.uid) {
      loadAccountType(user.uid);
    }
  }, [user]);

  const getOrders = (date) => {
    try {
      onSnapshot(doc(db, "orders", date), (snapshot) => {
        if (snapshot) {
          if (snapshot.data()) {
            if (!account || account === "user") {
              // console.log("trigged user acc type");
              let count = 0;
              let tempArr = {};
              for (let [key, value] of Object.entries(snapshot.data())) {
                count++;
                let end = Object.entries(snapshot.data()).length;
                let tempEmail = value.email.toLowerCase();
                let tempEmailUser = user.email;
                if (
                  tempEmailUser === tempEmail &&
                  value.status !== "completed"
                ) {
                  tempArr = { value };

                  if (count === end) {
                    orderStatus.current.hasOwnProperty("value") &&
                    tempArr.hasOwnProperty("value")
                      ? (orderStatus.current.value.status !==
                          tempArr.value.status) |
                        (orderStatus.current.value.pickupTime !==
                          tempArr.value.pickupTime) |
                        (orderStatus.current.value.refundData.length !==
                          tempArr.value.refundData.length)
                        ? (setliveOrder(tempArr),
                          (orderStatus.current = tempArr))
                        : null
                      : (setliveOrder(tempArr),
                        (orderStatus.current = tempArr));
                  }
                } else {
                  if (count === end) {
                    orderStatus.current.hasOwnProperty("value") &&
                    tempArr.hasOwnProperty("value")
                      ? (orderStatus.current.value.status !==
                          tempArr.value.status) |
                        (orderStatus.current.value.pickupTime !==
                          tempArr.value.pickupTime) |
                        (orderStatus.current.value.refundData.length !==
                          tempArr.value.refundData.length)
                        ? (setliveOrder(tempArr),
                          (orderStatus.current = tempArr))
                        : null
                      : (setliveOrder(tempArr),
                        (orderStatus.current = tempArr));
                  }
                }
              }
            }
            if (account === "restaurant") {
              let i = 0;
              let tempArr = [];
              for (let [key, value] of Object.entries(snapshot.data()).sort(
                (a, b) => b[1].number - a[1].number
              )) {
                i++;

                let tempEmail = value.restaurantEmail.toLowerCase();
                let tempEmailUser = user.email;
                if (tempEmailUser === tempEmail) {
                  tempArr.push({ value });
                  if (Object.entries(snapshot.data()).length === i) {
                    setliveOrder(tempArr);
                  }
                } else {
                  if (Object.entries(snapshot.data()).length === i) {
                    setliveOrder(tempArr);
                  }
                }
              }
            }
          }
        }
      });
    } catch (e) {
      alert("Issue pulling collection list");
      return;
    }
  };

  const getOldOrders = (date) => {
    setIsLoading(true);
    setOldOrders([]);

    try {
      onSnapshot(doc(db, "orders", date.label), (snapshot) => {
        if (snapshot) {
          if (snapshot.data()) {
            if (!account || account === "user") {
              let tempEmailUser = user.email;
              for (let [key, value] of Object.entries(snapshot.data())) {
                let tempEmail = value.restaurantEmail.toLowerCase();
                if (
                  tempEmailUser === tempEmail &&
                  value.status !== "complete"
                ) {
                  setIsLoading(false);
                  setOldOrders({ key, value });
                }
              }
            }
            if (account === "restaurant") {
              setOldOrders([]);
              let i = 0;
              let tempArr = [];
              let tempEmailUser = user.email;
              for (let [key, value] of Object.entries(snapshot.data())) {
                let tempEmail = value.restaurantEmail.toLowerCase();
                i++;
                if (tempEmailUser === tempEmail) {
                  tempArr.push({ value });
                  if (Object.entries(snapshot.data()).length === i) {
                    setIsLoading(false);
                    setOldOrders(tempArr);
                  }
                } else {
                  if (Object.entries(snapshot.data()).length === i) {
                    setIsLoading(false);
                    setOldOrders(tempArr);
                  }
                }
                // if user and there is an order that is NOT complete, then save order to setOrder variable to be pulled into navigator.
              }
            } else if (account === "admin") {
              setOldOrders([]);
              let i = 0;
              let tempArr = [];
              for (let [key, value] of Object.entries(snapshot.data())) {
                i++;
                tempArr.push({ value });
                if (Object.entries(snapshot.data()).length === i) {
                  setIsLoading(false);
                  setOldOrders(tempArr);
                }

                // if user and there is an order that is NOT complete, then save order to setOrder variable to be pulled into navigator.
              }
            }
          } else {
            setIsLoading(false);
            return;
          }
        } else {
          setIsLoading(false);
          return;
        }
      });
    } catch (e) {
      setIsLoading(false);
      alert("Issue pulling collection list");
      return;
    }
  };

  const getOldUserOrders = (email) => {
    setIsLoading(true);
    setOldUserOrders([]);
    let tempEmailUser = user.email;
    try {
      onSnapshot(doc(db, "users", tempEmailUser), (snapshot) => {
        if (snapshot) {
          if (snapshot.data()) {
            let tempArr = [];
            let end = Object.entries(snapshot.data()).length;
            let count = 0;
            for (let [key, value] of Object.entries(snapshot.data())) {
              count++;
              tempArr.unshift({ value });
              if (end === count) {
                setIsLoading(false);
                setOldUserOrders(tempArr);
              }
              if (end === 0 || typeof end === "undefined") {
                setIsLoading(false);
                return;
              }
              // if user and there is an order that is NOT complete, then save order to setOrder variable to be pulled into navigator.
            }
            if (end === 0) {
              setIsLoading(false);
              return;
            }
          } else {
            setIsLoading(false);
            return;
          }
        } else {
          setIsLoading(false);
          return;
        }
      });
    } catch (e) {
      setIsLoading(false);
      alert("Issue pulling collection list");
      return;
    }
  };

  useEffect(() => {
    var todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    let useDate = todayDate.toISOString().slice(0, 10);

    // console.log(todayDate.getUTCHours());
    setFullDate(
      todayDate.setMinutes(
        todayDate.getMinutes() - todayDate.getTimezoneOffset()
      )
    );
    setToday(useDate);

    if (todayDate) {
      getOrders(today);
    }
  }, [today, user.email, accountType, account, user]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        error,
        getOrders,
        liveOrder,
        today,
        fullDate,
        getOldOrders,
        getOldUserOrders,
        oldOrders,
        oldUserOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
