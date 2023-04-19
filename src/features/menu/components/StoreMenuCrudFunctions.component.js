/* eslint-disable prettier/prettier */
import { arrayRemove, arrayUnion, doc, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "../../../../App";

export const Update = async (merge, loc, menu, name, isShow) => {
  //   console.log(value);
  //   console.log(loc);
  //   console.log(merge);
  //updating doc
  const oldValue = {
    name: name,
    isShowing: isShow,
  };

  const newValue = {
    name: name,
    isShowing: !isShow,
  };

  const updateDoc = doc(db, "restaurants", loc);
  //setting merge true makes it merge with existing doc or it will create a new/fresh one

  await setDoc(
    updateDoc,
    {
      menus: {
        [menu]: {
          properties: arrayRemove(oldValue),
        },
      },
    },
    { merge: merge }
  )
    .then(() => {})
    .catch((error) => {
      alert("Could not update");
    });

  await setDoc(
    updateDoc,
    {
      menus: {
        [menu]: {
          properties: arrayUnion(newValue),
        },
      },
    },
    { merge: merge }
  )
    .then(() => {
      alert("Updated Document!");
    })
    .catch((error) => {
      alert("Could not update");
    });
};
