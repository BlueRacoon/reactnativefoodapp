/* eslint-disable prettier/prettier */
import React, { useState, createContext, useEffect } from "react";
import { initializeApp } from "firebase/app";

import { LoginRequest } from "./authentication.service";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { Alert } from "react-native";

// const firebaseConfig = {
///////////REMOVED
// };

// UseSentry.Native.nativeCrash();

const firebaseConfig = {
  ///////////REMOVED
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState([]);
  const [accountType, setAccountType] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  // useEffect(() => {
  //   console.log(accountType);
  // }, [accountType]);

  const CheckAccount = async (input) => {
    return new Promise(async (resolve, reject) => {
      let email = input.toLowerCase();
      setUserEmail(email);

      const readAdminDocs = doc(db, "authenticate", "admin");
      const readRestaurantDocs = doc(db, "authenticate", "restaurants");
      try {
        // console.log("Try block TRIGGERED");
        await onSnapshot(readAdminDocs, (adminsnapshot) => {
          // console.log(adminsnapshot.data().emails.indexOf(email));
          if (adminsnapshot.data().emails.indexOf(email) !== -1) {
            // console.log("Admin Account");
            setAccountType("admin");
            resolve("admin");
          } else {
            onSnapshot(readRestaurantDocs, (restsnapshot) => {
              // console.log(snapshot.data().emails.indexOf(email));
              if (restsnapshot.data().emails.indexOf(email) !== -1) {
                // console.log("Restaurant Account");
                setAccountType("restaurant");
                resolve("restaurant");
              } else {
                setAccountType("user");
                resolve("user");
              }
            });
          }
        });
      } catch {
        (e) => {
          setIsLoading(false);
          // console.log("error triggered");
          //if we want more specific errors later. Can use below
          // const { code, details, decline_code } = JSON.parse(JSON.stringify(e));
          setError("Invalid Email / Password");
          reject();
        };
      }
    });
  };

  auth.onAuthStateChanged((usr) => {
    if (usr) {
      CheckAccount(usr.email).then((res) => {
        setUser(usr);
        saveAccountType(res, usr.uid);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  });

  const saveAccountType = async (value, uid) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@accountType-${uid}`, jsonValue);
    } catch (e) {
      // console.log("error storing accountType locally", e);
    }
  };

  const onLogin = async (email, password) => {
    setIsLoading(true);
    setError([]);

    LoginRequest(email, password)
      .then((u) => {
        CheckAccount(email).then((acc) => {
          setAccountType(acc);
          saveAccountType(acc, u.uid);
          setUser(u);
          setIsLoading(false);
          return true;
        });
      })
      .catch((e) => {
        // console.log("error pinging?");
        setIsLoading(false);
        setError("Invalid Email / Password");
      });
  };

  const onLogout = () => {
    setUser(null);
    setAccountType(null);
    setUserEmail(null);
    // auth.signOut();
    signOut(auth)
      .then(() => {
        setUser(null);
        setAccountType(null);
        // console.log("Sign-out successful.");
        // console.log(user.uid);
      })
      .catch((error) => {
        // console.log("Error happened");
      });
  };

  const hashIt = async (password) => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return digest;
  };

  const onRegister = async (email, password, repeatedPassword) => {
    if (password !== repeatedPassword) {
      setError("Passwords do not match!");
      return;
    } else if (password.length < 7) {
      setError("Password needs at least 7 characters");
      return;
    } else {
      setIsLoading(true);
      //HASH IMPLEMENTED - JUST NEEDS TO BE TURNED ON AND PULLED INTO FIREBASE FUNCTION ONCE APP RESET
      // let hash = await hashIt(password);
      // console.log(hash);
      let tempEmail = email.toLowerCase();
      // console.log("password");
      createUserWithEmailAndPassword(getAuth(), tempEmail, password)
        .then((u) => {
          setUser(u);
          try {
            const docRef = doc(db, "users", tempEmail);
            setDoc(docRef, {}, { merge: true });
            setIsLoading(false);
          } catch (e) {
            setIsLoading(false);
          }
        })
        .catch((e) => {
          setIsLoading(false);
          //error is not handled on screen for user to see.
          Alert.alert("Issue with registration! Please try again later.");
          //if we want more specific errors later. Can use below
          const { code, details, decline_code } = JSON.parse(JSON.stringify(e));
          setError(e.message.replace("Firebase:", ""));
        });
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onLogin,
        onRegister,
        onLogout,
        accountType,
        userEmail,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
