import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import React, { useState, useEffect } from "react";
import { theme } from "./src/infrastructure/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { Navigation } from "./src/infrastructure/navigation/index";
// import * as Sentry from "sentry-expo";

// // import * as Sentry from "@sentry/react-native";

// Sentry.init({
/////////////REMOVED
//   // enableInExpoDevelopment: true,
//   // enabledNative: true,
//   // onerror: true,
//   // tracesSampleRate: 1.0,
//   // debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

// Sentry.setTag("myTag", "tag-value");
// Sentry.setExtra("myExtra", "extra-value");
// Sentry.addBreadcrumb({ message: "test" });

const firebaseConfig = {
  ///////////REMOVED
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     signInWithEmailAndPassword(auth, "zach@gmail.com", "test123")
  //       .then((user) => {
  //         // console.log(user);
  //         setIsAuthenticated(true);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   }, 2000);
  //   [];
  // });

  // Sentry.captureException("This is an error message");
  // throw new Error("My first Sentry error!");

  let [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });
  let [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  // if (!isAuthenticated) return null

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthenticationContextProvider
        // onError={(error) => {
        //   Sentry.Native.captureException(error);
        // }}
        >
          <Navigation
          // onError={(error) => {
          //   Sentry.Native.captureException(error);
          // }}
          />
        </AuthenticationContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}
