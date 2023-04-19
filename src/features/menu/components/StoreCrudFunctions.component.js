/* eslint-disable prettier/prettier */
import { arrayRemove, arrayUnion, doc, setDoc } from "firebase/firestore";
import React from "react";
import { Alert } from "react-native";
import { db } from "../../../../App";

export const UpdateCat = async (merge, loc, menu, name, isShow) => {
  return new Promise((resolve, reject) => {
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
    try {
      setDoc(
        updateDoc,
        {
          menus: {
            [menu]: {
              properties: arrayRemove(oldValue),
            },
          },
        },
        { merge: merge }
      ).then(() => {
        setDoc(
          updateDoc,
          {
            menus: {
              [menu]: {
                properties: arrayUnion(newValue),
              },
            },
          },
          { merge: merge }
        ).then(() => {
          Alert.alert("Status updated!");
          resolve(true);
        });
      });
    } catch (error) {
      Alert.alert("Could not fully update category!");
      resolve(true);
    }
  });
};

export const UpdateItemShowing = async (
  merge,
  itemLoc,
  itemMenu,
  itemCat,
  itemIsShow,
  menuItem
) => {
  //updating doc
  return new Promise((resolve, reject) => {
    const oldValue = { ...menuItem };
    oldValue.isShowing = itemIsShow;

    const newValue = { ...menuItem };
    newValue.isShowing = !itemIsShow;

    const updateDoc = doc(db, "restaurants", itemLoc);
    //setting merge true makes it merge with existing doc or it will create a new/fresh one
    if (newValue && oldValue) {
      try {
        setDoc(
          updateDoc,
          {
            menus: {
              [itemMenu]: {
                [itemCat]: arrayRemove(oldValue),
              },
            },
          },
          { merge: true }
        ).then(() => {
          // console.log("got through remove array part");
          setDoc(
            updateDoc,
            {
              menus: {
                [itemMenu]: {
                  [itemCat]: arrayUnion(newValue),
                },
              },
            },
            { merge: merge }
          ).then(() => {
            Alert.alert("Item status updated!");
            resolve(true);
          });
        });
      } catch (error) {
        Alert.alert("Could not fully update item status");
        resolve(true);
      }
    } else {
      Alert.alert("Could not fully update item status");
      resolve(true);
    }
  });
};

export const UpdateItemAvailable = async (
  merge,
  itemLoc,
  itemMenu,
  itemCat,
  itemAvailable,
  menuItem
) => {
  //updating doc
  return new Promise((resolve, reject) => {
    const oldValue = { ...menuItem };
    oldValue.isAvailable = itemAvailable;

    const newValue = { ...menuItem };
    newValue.isAvailable = !itemAvailable;

    const updateDoc = doc(db, "restaurants", itemLoc);
    //setting merge true makes it merge with existing doc or it will create a new/fresh one

    try {
      setDoc(
        updateDoc,
        {
          menus: {
            [itemMenu]: {
              [itemCat]: arrayRemove(oldValue),
            },
          },
        },
        { merge: true }
      ).then(() => {
        setDoc(
          updateDoc,
          {
            menus: {
              [itemMenu]: {
                [itemCat]: arrayUnion(newValue),
              },
            },
          },
          { merge: merge }
        ).then(() => {
          Alert.alert("Item status updated!");
          resolve(true);
        });
      });
    } catch (error) {
      Alert.alert("Could not fully update item status!");
      resolve(true);
    }
  });
};
