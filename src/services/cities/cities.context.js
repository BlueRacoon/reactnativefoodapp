/* eslint-disable prettier/prettier */
import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../../App";
import { RestaurantsContext } from "../restaurants/restaurants.context";

export const CitiesContext = createContext();

export const CitiesContextProvider = ({ children }) => {
  const [citiesList, setCitiesList] = useState([]);
  const [cityListToGet, setCityListToGet] = useState([]);
  const [error, setError] = useState(null);
  const { restList } = useContext(RestaurantsContext);

  // useEffect(() => {
  //   console.log(cityListToGet);
  // }, [cityListToGet]);

  useEffect(() => {
    let tempArr = [];
    let end = restList.length;
    let count = 0;
    restList.map((rest) => {
      count++;
      if (tempArr.includes(rest.city)) {
        if (end === count) {
          setCityListToGet(tempArr);
          return;
        }
      } else {
        tempArr.push(rest.city);
        if (end === count) {
          setCityListToGet(tempArr);
          return;
        }
      }
    });
  }, [restList]);

  useEffect(() => {
    try {
      onSnapshot(collection(db, "cities"), (snapshot) => {
        // console.log(snapshot.docs.length);
        let end = snapshot.docs.length;
        let count = 0;
        let tempArr = [];
        snapshot.docs.map((doc) => {
          count++;
          let data = doc.data();
          if (data.cityName === "All Locations") {
            tempArr.push(data);
            if (end === count) {
              setCitiesList(tempArr);
            }
          } else if (data.cityShowing && !tempArr.includes(data.cityName)) {
            tempArr.push(data);
            if (end === count) {
              setCitiesList(tempArr);
            }
          } else {
            if (end === count) {
              setCitiesList(tempArr);
            }
          }
        });
      });
    } catch (e) {
      alert("Issue pulling cities list");
      return;
    }
  }, [cityListToGet]);

  return (
    <CitiesContext.Provider
      value={{
        citiesList,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
