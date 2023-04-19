/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../App";

export const getData = () =>
  onSnapshot(collection(db, "restaurants"), (snapshot) => {
    // console.log("snapSHOT");
    snapshot.docs.map((doc) => doc.data());
  });
