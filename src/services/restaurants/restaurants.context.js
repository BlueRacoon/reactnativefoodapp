/* eslint-disable prettier/prettier */
import React, { useState, useContext, createContext, useEffect } from "react";
import { LocationContext } from "../location/location.context";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../App";
import camelize from "camelize";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { keyword } = useContext(LocationContext);
  const [restList, setRestList] = useState([]);
  const [localDay, setLocalDay] = useState("");
  const [useTime, setUseTime] = useState(null);
  const [menu, setMenu] = useState(null);
  const [singleRest, setSingleRest] = useState(null);

  //ADDING IN OUR REAL RESTAURANTS FROM FIREBASE

  const getObjKey = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const setTimeForUse = () => {
    return new Promise((resolve, reject) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

      const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
      let tempDay = weekday[d.getDay()];
      // console.log("SETTING DAY TO :", tempDay);
      setLocalDay(tempDay);

      let hour = d.getUTCHours();
      let minutes = d.getMinutes();

      //force time check
      // let hour = parseFloat("01");
      // let minutes = parseFloat("01");

      if (`${minutes}`.length > 1) {
        if (`${hour}`.length > 1) {
          setUseTime(parseFloat(`${hour}${minutes}`));
          let tempTime = parseFloat(`${hour}${minutes}`);
          // console.log("LocalDay:", localDay);
          resolve({ tempDay, tempTime });
        } else {
          // console.log("truggeres");
          setUseTime(parseFloat(`0${hour}${minutes}`));
          let tempTime = parseFloat(`0${hour}${minutes}`);
          // console.log("LocalDay:", localDay);
          resolve({ tempDay, tempTime });
        }
      } else {
        if (`${hour}`.length > 1) {
          setUseTime(parseFloat(`${hour}0${minutes}`));
          let tempTime = parseFloat(`${hour}0${minutes}`);
          // console.log("LocalDay:", localDay);
          resolve({ tempDay, tempTime });
        } else {
          setUseTime(parseFloat(`0${hour}0${minutes}`));
          let tempTime = parseFloat(`0${hour}0${minutes}`);
          // console.log("LocalDay:", localDay);
          resolve({ tempDay, tempTime });
        }
      }
    });
  };

  const getOneRestaurant = (name) => {
    return new Promise((resolve, reject) => {
      try {
        onSnapshot(collection(db, "restaurants"), (snapshot) => {
          snapshot.docs.map((doc) => {
            if (doc.data().name === name) {
              let data = doc.data();
              if (typeof data.hours[localDay]?.menus !== "undefined") {
                // console.log("passed typeof statement");
                Object.values(data.hours[localDay]?.menus).map((r) => {
                  // console.log("r:", r);
                  // console.log(useTime);
                  if (
                    (parseFloat(useTime) > parseFloat(r.substring(0, 4)) &&
                      parseFloat(useTime) < parseFloat(r.substring(5, 9))) ||
                    r === "All Day"
                  ) {
                    let key = getObjKey(data.hours[localDay].menus, r);
                    // console.log(data.hours[localDay].menus);
                    data = {
                      ...data,
                      hours: data.hours[localDay].time,
                      menus: data.menus[key],
                      menuSelected: key,
                    };
                    resolve(data);
                  }
                });
              } else {
                return null;
              }
              return null;
            }
          });
        });
      } catch {
        resolve(null);
      }
    });
  };

  const restaurantsRequest = (searchWord, tempDay, tempTime) => {
    // console.log("rest req triggered");
    try {
      onSnapshot(collection(db, "restaurants"), (snapshot) => {
        let tempArr = [];
        let count = 0;
        snapshot.docs.map((doc) => {
          count++;
          let end = snapshot.docs.length;
          // console.log("end: ", end);
          // console.log("searchWord", searchWord);
          if (doc.data().city === searchWord || searchWord === "") {
            let data = doc.data();
            // console.log("data name:", data.name);
            if (
              typeof data.hours[tempDay]?.menus !== "undefined" &&
              data.hours[tempDay]?.menus.length !== 0
            ) {
              Object.values(data.hours[tempDay]?.menus).map((r) => {
                // console.log("data name second spot:", data.name);
                // console.log("r:", r);
                // console.log("useTime", tempTime);
                //check for usetime here and get if it is undefined

                if (
                  (parseFloat(tempTime) > parseFloat(r.substring(0, 4)) &&
                    parseFloat(tempTime) < parseFloat(r.substring(5, 9))) ||
                  r === "All Day"
                ) {
                  // console.log("b4 key");
                  let key = getObjKey(data.hours[tempDay].menus, r);
                  // console.log(data.hours[localDay].menus);
                  // console.log("data name third spot:", data.name);
                  data = {
                    ...data,
                    hours: data.hours[tempDay].time,
                    menus: data.menus[key],
                    menuSelected: key,
                  };
                  tempArr.push(data);

                  if (end === count) {
                    setRestList(tempArr);
                    return;
                  }
                } else {
                  if (end === count) {
                    setRestList(tempArr);
                    return;
                  }
                }
              });
            } else {
              if (end === count) {
                setRestList(tempArr);
                return;
              }
            }
          } else {
            if (end === count) {
              setRestList(tempArr);
              return;
            }
          }
        });
      });
    } catch (e) {
      alert("Issue pulling collection list");
      return;
    }
  };

  // will need to move useEffect into Function or it will iterate in circles

  const finish = async () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const retrieveRestaurants = async (keySearch) => {
    (typeof keySearch === "undefined") | !keySearch
      ? (keySearch = keyword)
      : null;

    keySearch === "All Locations" ? (keySearch = "") : keySearch;
    setIsLoading(true);
    setRestList([]);
    await setTimeForUse().then((res) => {
      // console.log("tempDay", res.tempDay);
      // console.log("tempTime", res.tempTime);
      restaurantsRequest(keySearch, res.tempDay, res.tempTime);
      setIsLoading(false);
    });
    await finish().catch((err) => {
      setIsLoading(false);
      setError(err);
    });
  };

  const retrieveOneRestaurant = async (keySearch) => {
    return new Promise((resolve, reject) => {
      setTimeForUse().then((tempDay) => {
        getOneRestaurant(keySearch, tempDay).then((result) => {
          resolve(result);
        });
      });
    });
  };

  useEffect(() => {
    if (keyword) {
      retrieveRestaurants(keyword);
    } else {
      retrieveRestaurants("");
    }
  }, [keyword]);

  return (
    <RestaurantsContext.Provider
      value={{
        isLoading,
        error,
        restList,
        localDay,
        useTime,
        retrieveOneRestaurant,
        getOneRestaurant,
        retrieveRestaurants,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
};
