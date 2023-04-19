/* eslint-disable prettier/prettier */
// import { mockImages, mocks } from "./mock";
//  ^^ use for static requests
import camelize from "camelize";
import { host } from "../../utils/env";

// GOOGLE API EXAMPLE CODE
// DELETE "&mock=true" to use GOOGLE API

// export const restaurantsRequest = (location) => {
//   return fetch(`${host}/placesNearby?location=${location}&mock=true`).then(
//     (res) => {
//       return res.json();
//     }
//   );
// };

export const restaurantsTransform = ({ results = [] }) => {
  const mappedResults = results.map((restaurant) => {
    return {
      ...restaurant,
      // photos: [],
      address: restaurant.vicinity,
      isOpenNow: restaurant.opening_hours && restaurant.opening_hours.open_now,
      isClosedTemporarily: restaurant.business_status === "CLOSED_TEMPORARILY",
    };
  });
  //   const newResult = camelize(results.length);
  //   console.log(mappedResults);
  return camelize(mappedResults);
};

// USE FOR STATIC RESTAURANT REQUESTS

// export const restaurantsRequest = (location) => {
//   return new Promise((resolve, reject) => {
//     const mock = mocks[location];
//     if (!mock) {
//       reject("not found");
//     }
//     resolve(mock);
//   });
// };

// export const restaurantsTransform = ({ results = [] }) => {
//   const mappedResults = results.map((restaurant) => {
//     restaurant.photos = restaurant.photos.map((p) => {
//       return mockImages[Math.ceil(Math.random() * (mockImages.length - 1))];
//     });
//     return {
//       ...restaurant,
//       address: restaurant.vicinity,
//       isOpenNow: restaurant.opening_hours && restaurant.opening_hours.open_now,
//       isClosedTemporarily: restaurant.business_status === "CLOSED_TEMPORARILY",
//     };
//   });
//   //   const newResult = camelize(results.length);
//   //   console.log(mappedResults);
//   return camelize(mappedResults);
// };
