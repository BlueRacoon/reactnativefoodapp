/* eslint-disable prettier/prettier */
const { mocks, addMockImage } = require("./mock");
const url = require("url");

module.exports.placesRequest = (request, response, client) => {
  const { location, mock } = url.parse(request.url, true).query;
  if (mock === "true") {
    const data = mocks[location];
    if (data) {
      data.results = data.results.map(addMockImage);
    }
    return response.json(data);
  }
  client
    .placesNearby({
      params: {
        location: location,
        radius: 1500,
        type: "restaurant",
        key: process.env.REACT_APP_GOOGLE_KEY,
      },
      timeout: 1000,
    })
    .then((res) => {
      // console.log(res.data.results);
      res.data.results = res.data.results.map(addMockImage);
      return response.json(res.data);
    })
    .catch((e) => {
      response.status(400);
      return response.send(e.response.data.error_message);
    });
};
