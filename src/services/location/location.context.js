/* eslint-disable prettier/prettier */
import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, createContext, useEffect } from "react";
import { db } from "../../../App";
import { locationTransform } from "./location.service";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [keyword, setKeyword] = useState("All Locations");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   console.log("loc", location);
  // }, [location]);

  const onSearch = (searchKeyword) => {
    setIsLoading(true);
    setKeyword(searchKeyword);
  };

  useEffect(() => {
    if (!keyword.length || keyword === "All Locations") {
      setError(null);
      setIsLoading(false);
      setLocation({
        lat: 33.7748,
        lng: -84.2963,
        viewport: {
          northeast: { lat: 34.531, lng: -83.8059 },
          southeast: { lat: 33.3048, lng: -83.6832 },
          southwest: { lat: 33.2868, lng: -84.7677 },
          northwest: { lat: 34.4362, lng: -84.6999 },
        },
      });
      return;
    } else {
      locationRequest(keyword)
        .then((res) => {
          //   console.log(res);
          setError(null);
          setIsLoading(false);
          // setLocation(res);
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err);
        });
    }
  }, [keyword]);

  const locationRequest = async (searchTerm) => {
    try {
      await onSnapshot(collection(db, "cities"), (snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().cityName.toLowerCase() === searchTerm.toLowerCase()) {
            // console.log(doc.data());
            let item = locationTransform(doc.data());
            setError(null);
            setIsLoading(false);
            setLocation(item);
            // console.log(item);
          }
        });
      });
    } catch (e) {
      setError(null);
      setIsLoading(false);
      alert("Issue pulling collection list");
      return;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        isLoading,
        error,
        location,
        search: onSearch,
        keyword,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
