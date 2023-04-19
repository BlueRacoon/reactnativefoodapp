/* eslint-disable prettier/prettier */
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "../authentication/authentication.context";
import { collection } from "firebase/firestore";
import { db } from "../../../App";
import { RestaurantsContext } from "../restaurants/restaurants.context";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const { retrieveOneRestaurant } = useContext(RestaurantsContext);
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [menuSelected, setMenuSelected] = useState(null);
  const [sum, setSum] = useState(0);

  // useEffect(() => {
  //   console.log(menuSelected);
  // }, [menuSelected]);

  const saveCart = async (rst, crt, uid, menu) => {
    if (rst) {
      // console.log("save func triggered");
      try {
        const jsonValue = JSON.stringify({
          restaurant: rst,
          cart: crt,
          menu: menu,
        });
        await AsyncStorage.setItem(`@cart-${uid}`, jsonValue);
      } catch (e) {
        // console.log("error storing", e);
      }
    } else {
      return;
    }
  };

  const clearLocalCart = async (uid) => {
    // console.log("triggered clear local cart");
    try {
      const jsonValue = JSON.stringify({
        restaurant: null,
        cart: [],
        menu: null,
      });
      await AsyncStorage.setItem(`@cart-${uid}`, jsonValue);
      // console.log("finished cleaing cart local");
    } catch (e) {
      // console.log("error storing", e);
    }
  };

  const loadCart = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(`@cart-${uid}`);
      if (value !== null) {
        const { restaurant: rst, cart: crt, menu: menu } = JSON.parse(value);

        if (rst) {
          retrieveOneRestaurant(rst.name).then((res) => {
            //prevents someone from ordering from an old cart when restaurant is closed manually.
            // console.log("is Open", res.isOpen);
            if (res) {
              setRestaurant(res);
              setMenuSelected(menu);
              setCart(crt);
            } else {
              setRestaurant(rst);
              setCart(crt);
              setMenuSelected(menu);
            }
          });
        } else {
          return;
        }
      }
    } catch (e) {
      // console.log("error loading cart");
    }
  };

  useEffect(() => {
    // console.log("triggered load");
    if (user && user.uid) {
      loadCart(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      // console.log("saving cart");
      saveCart(restaurant, cart, user.uid, menuSelected);
    }
  }, [restaurant, cart, user, menuSelected]);

  useEffect(() => {
    if (!cart.length) {
      setSum(0);
      return;
    }
    const newSum = cart.reduce((acc, { price }) => {
      return (acc += price);
    }, 0);
    setSum(newSum);
  }, [cart]);

  const add = (item, rst) => {
    if (
      !restaurant ||
      restaurant.name !== rst.name ||
      rst.menuSelected !== menuSelected ||
      !menuSelected
    ) {
      setMenuSelected(rst.menuSelected);
      setRestaurant(rst);
      setCart([item]);
    } else {
      setCart([...cart, item]);
    }
  };

  const update = (item, rst) => {
    if (
      !restaurant ||
      restaurant.name !== rst.name ||
      rst.menuSelected !== menuSelected ||
      !menuSelected
    ) {
      setRestaurant(rst);
      setMenuSelected(rst.menuSelected);
      setCart([...item]);
      // console.log("update finished");
    } else {
      setCart([...item]);
      // console.log("update finished");
    }
  };

  const updateFromOldOrders = (item, rst) => {
    setRestaurant(rst);
    setMenuSelected(rst.menuSelected);
    setCart([...item]);
  };

  const removeItem = (item) => {
    setCart(cart.filter((v) => v.id !== item));
  };

  // Need to add a remove functionality ourselves use how we remove things from array in +the restaurant create backend :)
  // const remove = (item) => {
  //   cart.filter((i) => item.id);
  // };

  const getKey = (item) => {
    let randKey = Math.random().toFixed(5);
    return `${cart.length}+${item}+${randKey}`;
  };

  const clear = async () => {
    setCart([]);
    setRestaurant(null);
    await clearLocalCart(user.uid);
  };

  return (
    <CartContext.Provider
      value={{
        addToCart: add,
        clearCart: clear,
        deleteItem: removeItem,
        keyFunction: getKey,
        updateCart: update,
        updateFromOldOrders,
        sum,
        restaurant,
        cart,
        menuSelected,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
