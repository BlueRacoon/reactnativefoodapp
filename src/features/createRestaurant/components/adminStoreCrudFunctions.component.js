/* eslint-disable prettier/prettier */
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../../../App";

export const Update = async (value, merge, loc) => {
  //   console.log(value);
  //   console.log(loc);
  //   console.log(merge);
  //updating doc
  const updateDoc = doc(db, "restaurants", loc);
  //setting merge true makes it merge with existing doc or it will create a new/fresh one
  await setDoc(updateDoc, value, { merge: merge })
    .then(() => {
      alert("Updated Document!");
    })
    .catch((error) => {
      alert("Could not update");
    });
};
