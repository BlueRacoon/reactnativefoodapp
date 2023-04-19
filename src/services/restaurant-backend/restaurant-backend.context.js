/* eslint-disable prettier/prettier */
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from "react";

import { LocationContext } from "../location/location.context";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../App";
import camelize from "camelize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "../authentication/authentication.context";
import { G } from "react-native-svg";

export const RestaurantBackendContext = createContext();

export const RestaurantBackendContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);

  const [getMenusItems, setGetMenusItems] = useState(false);
  const [localData, setLocalData] = useState(false);
  const [menuList, setMenuList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restList, setRestList] = useState([]);
  const [restaurantDates, setRestaurantDates] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [currentlyLoading, setCurrentlyLoading] = useState(false);
  const { userEmail, user } = useContext(AuthenticationContext);

  const [day, setDay] = useState(null);
  // const useMemo(weekday) = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

  const weekday = useMemo(
    () => ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"],
    []
  );

  useEffect(() => {
    var b = new Date();
    b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
    setDay(weekday[b.getDay()]);
  }, [weekday]);

  useEffect(() => {
    var b = new Date();
    b.setMinutes(b.getMinutes() - b.getTimezoneOffset());

    var now = new Date();
    var daysOfYear = [];
    for (
      var useD = new Date(localData.createdAt);
      useD <= now;
      useD.setDate(useD.getDate() + 1)
    ) {
      daysOfYear.push({
        label: new Date(useD).toISOString().slice(0, 10),
        value: new Date(useD).toISOString().slice(0, 10),
      });
      if (useD.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)) {
        setRestaurantDates(daysOfYear);
      }
    }
  }, [localData]);

  useEffect(() => {
    const restRef = getDocs(collection(db, "restaurants"))
      .then((data) => {
        data.forEach((doc) => {
          let tempEmail = doc.data().email.toLowerCase();
          // console.log("temp", tempEmail);
          // console.log("user", user.email);
          if (tempEmail === user.email || tempEmail === userEmail) {
            setCurrentRestaurant(doc.data().name);
            // console.log("docname", doc.data().name);
            try {
              const jsonValue = JSON.stringify(doc.data().name);
              AsyncStorage.setItem(`@currentRestaurant-${user.uid}`, jsonValue);
            } catch (e) {
              // console.log("error storing accountType locally", e);
            }
          }
        });
      })
      .then(() => {
        try {
          // console.log("current", currentRestaurant);
          onSnapshot(doc(db, "restaurants", currentRestaurant), (snapshot) => {
            let data = snapshot.data();
            // console.log("data", data.name);

            setLocalData(data);
            // console.log(localData);
            setMenuList([]);
            setGetMenusItems([]);
            // console.log(data.menus);
            if (typeof data?.menus !== "undefined") {
              for (let [key] of Object.entries(data.menus)) {
                // console.log(`${key}`);
                setMenuList((oldArray) => [...oldArray, `${key}`]);
                setGetMenusItems((oldArray2) => [
                  ...oldArray2,
                  {
                    label: `${key}`,
                    value: `${key}`,
                  },
                ]);
              }
            }
          });
        } catch (e) {
          // alert("Issue pulling collection list");
          return;
        }
      });
  }, [userEmail, currentRestaurant, user.uid]);

  const loadCurrentRestaurant = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(
        `@currentRestaurant-${user.uid}`
      );

      if (value !== null) {
        setCurrentRestaurant(JSON.parse(value));
        // console.log(currentRestaurant);
      }
    } catch (e) {
      // console.log("error loading favorites from local", e);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      loadCurrentRestaurant(user.uid);
    }
  }, [user]);

  const finish = async () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <RestaurantBackendContext.Provider
      value={{
        restaurants,
        isLoading,
        error,
        restList,
        localData,
        RestName: localData.name,
        day,
        menuList,
        restaurantDates,
      }}
    >
      {children}
    </RestaurantBackendContext.Provider>
  );
};
