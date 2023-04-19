/* eslint-disable prettier/prettier */
const { locations: locationsMock } = require("./geocode.mock");
const url = require("url");
const functions = require("firebase-functions");
// const GOOGLE_KEY = require("../../src/utils/env");

module.exports.geocodeRequest = (request, response, client) => {
  const { city, mock } = url.parse(request.url, true).query;
  if (mock === "true") {
    const locationMock = locationsMock[city.toLowerCase()];
    // console.log(process.env.REACT_APP_GOOGLE_KEY);
    return response.json(locationMock);
  }

  client
    .geocode({
      params: {
        address: city,
        key: process.env.REACT_APP_GOOGLE_KEY,
      },
      timeout: 1000,
    })
    .then((res) => {
      return response.json(res.data);
    })
    .catch((e) => {
      response.status(400);
      return response.send(e.response.data.error_message);
    });
};
