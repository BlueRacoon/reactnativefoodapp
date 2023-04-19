/* eslint-disable prettier/prettier */
import { async } from "@firebase/util";
import camelize from "camelize";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../App";
import { host } from "../../utils/env";
// import { locations } from "./location.mock";    <- use for static requests

//USE THIS SCRIPT FOR GOOGLE LOCATIONS FROM API

// DELETE "&mock=true" to use GOOGLE API

// export const locationRequest = (searchTerm) => {
//   return fetch(`${host}/geocode?city=${searchTerm}&mock=true`).then((res) => {
//     // console.log(`${host}/geocode?city=${searchTerm}`);
//     console.log(res.json());
//     return res.json();
//   });
// };

//Pulling from real data finally -> MOVED TO LOC CONTEXT DUE TO ISSUES WITH ASYNC/AWAIT

export const locationRequest = async (searchTerm) => {
  try {
    await onSnapshot(collection(db, "cities"), (snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.data().cityName.toLowerCase() === searchTerm.toLowerCase()) {
          // console.log(doc.data());
          let item = locationTransform(doc.data());
          // console.log(item);
          return item;
        }
      });
    });
  } catch (e) {
    alert("Issue pulling collection list");
    return;
  }
};

//USE THIS SCRIPT FOR STATIC LOCATIONS FROM THE LOCATION MOCK

// export const locationRequest = (searchTerm) => {
//   return new Promise((resolve, reject) => {
//     const locationMock = locations[searchTerm];
//     if (!locationMock) {
//       reject("notfound");
//     }
//     resolve(locationMock);
//   });
// };

// export const locationTransform = async (result) => {
//   const { geometry = {} } = formattedResponse.Object[0];
//   const { lat, lng } = geometry.location;
//   // console.log("hi");

//   return { lat, lng, viewport: geometry.viewport };
// };

export const locationTransform = (result) => {
  const formattedResponse = camelize(result);
  // const { geometry = {} } = formattedResponse;

  const { lat, lng } = formattedResponse.location;
  // console.log("hi");
  return { lat, lng, viewport: formattedResponse.viewport };
};
