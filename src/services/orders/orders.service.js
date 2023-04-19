/* eslint-disable prettier/prettier */
import { mockImages, mocks } from "./mock";
//  ^^ use for static requests
import camelize from "camelize";
// import { host } from "../../utils/env";

// GOOGLE API EXAMPLE CODE
// DELETE "&mock=true" to use GOOGLE API

// export const ordersRequest = (location) => {
//   return fetch(`${host}/placesNearby?location=${location}&mock=true`).then(
//     (res) => {
//       return res.json();
//     }
//   );
// };

// export const ordersTransform = ({ results = [] }) => {
//   const mappedResults = results.map((order) => {
//     return {
//       ...order,
//       // photos: [],
//       address: order.vicinity,
//       isOpenNow: order.opening_hours && order.opening_hours.open_now,
//       isClosedTemporarily: order.business_status === "CLOSED_TEMPORARILY",
//     };
//   });
//   //   const newResult = camelize(results.length);
//   //   console.log(mappedResults);
//   return camelize(mappedResults);
// };

// USE FOR STATIC RESTAURANT REQUESTS

export const ordersRequest = (location) => {
  return new Promise((resolve, reject) => {
    const mock = mocks[location];
    if (!mock) {
      reject("not found");
    }
    resolve(mock);
  });
};

export const ordersTransform = ({ results = [] }) => {
  const mappedResults = results.map((order) => {
    order.photos = order.photos.map((p) => {
      return mockImages[Math.ceil(Math.random() * (mockImages.length - 1))];
    });
    return {
      ...order,
      address: order.vicinity,
      isOpenNow: order.opening_hours && order.opening_hours.open_now,
      isClosedTemporarily: order.business_status === "CLOSED_TEMPORARILY",
    };
  });
  //   const newResult = camelize(results.length);
  //   console.log(mappedResults);
  return camelize(mappedResults);
};
