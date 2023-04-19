const functions = require("firebase-functions");
// const { geocodeRequest } = require("./geocode");
// const { placesRequest } = require("./places");
const { payRequest } = require("./pay");
const { refundRequest } = require("./refund");
// const { refund } = require("./refund");

// const { Client } = require("@googlemaps/google-maps-services-js");
// const stripeClient = require("stripe")(process.env.STRIPE_KEY);

const stripeClient = require("stripe")(functions.config().stripe.key);

const DoorDashClient = require("@doordash/sdk");

const {
  createTestDelivery,
  getDeliveryStatus,
  getDeliveryQuote,
} = require("./delivery");

///////////REMOVED

//// FIND ME
// const googleClient = new Client({});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.geocode = functions.https.onRequest((request, response) => {
//   geocodeRequest(request, response, googleClient);
// });

// exports.placesNearby = functions.https.onRequest((request, response) => {
//   placesRequest(request, response, googleClient);
// });

exports.pay = functions.https.onRequest((request, response) => {
  payRequest(request, response, stripeClient);
});

exports.refund = functions.https.onRequest((request, response) => {
  refundRequest(request, response, stripeClient);
});

exports.testDelivery = functions.https.onRequest((request, response) => {
  createTestDelivery(request, response, DoorDashClient);
});

exports.getDeliveryStatus = functions.https.onRequest((request, response) => {
  getDeliveryStatus(request, response, DoorDashClient);
});

exports.getDeliveryQuote = functions.https.onRequest((request, response) => {
  getDeliveryQuote(request, response, DoorDashClient);
});

// exports.secret = functions.https.onRequest((request, response) => {
//   secretRequest(request, response, stripeClient);
// });
