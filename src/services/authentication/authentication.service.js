/* eslint-disable prettier/prettier */
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import BcryptReactNative from "bcrypt-react-native";
import * as Crypto from "expo-crypto";

const hashIt = async (password) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
};

export const LoginRequest = async (email, password) => {
  // console.log("LOGIN REQUEST TRIGGERED");

  //HASH ALREADY IMPLEMENTED AND WORKING - JUST NEED TO TIE INTO REGISTER AND THEN TURN ON ONCE APP RESET

  let hash = await hashIt(password);

  // console.log(hash);
  // await getAuth().signInWithEmailAndPassword(email, password);
  return signInWithEmailAndPassword(getAuth(), email, password);
};

export const ResetPasswordRequest = async (email) => {
  try {
    await sendPasswordResetEmail(getAuth(), email);
  } catch (e) {
    return e;
  }
};
