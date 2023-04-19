/* eslint-disable prettier/prettier */

// console.log(process.env.NODE_ENV);  USE TO CHECK ENV DEV OR PROD

//ANDROID CAN NOT RUN HTTP LOCALLY. CAN ONLY RUN HTTPS. USE LIVE API TO TEST ANDROID APIS IF ISSUE OR USE - npx ngrok http url

//FIREBASE API
///////////REMOVED
const liveHost = "REMOVED";

//LOCAL API
///////////REMOVED
const localHost = "REMOVED";

// export const isDevelopment = process.env.NODE_ENV === "development";
export const isDevelopment = process.env.NODE_ENV === "testhost";

export const host = isDevelopment ? localHost : liveHost;
