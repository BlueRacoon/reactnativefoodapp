/* eslint-disable prettier/prettier */
import { UserNavigator } from "./user.navigator";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { AdminNavigator } from "./admin.navigator";
import { RestaurantNavigator } from "./restaurant.navigator";
import { LoadingScreen } from "./loading.navigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AccountTypeNavigator = () => {
  const { accountType, user } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState(accountType);
  // const [account, setAccount] = useState("admin");

  // console.log("Account type:", account);
  // console.log("user:", user.uid);

  const loadAccountType = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(`@accountType-${uid}`);

      if (value !== null) {
        setAccount(JSON.parse(value));
        return;
      }
    } catch (e) {
      // console.log("error loading favorites from local", e);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      loadAccountType(user.uid);
    }
  }, [user]);

  useEffect(() => {
    account
      ? setIsLoading(false)
      : // setTimeout(() => setIsLoading(false), 1800);
        null;
  }, [account]);

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    if (account === "admin") {
      return <AdminNavigator />;
    }
    if (account === "restaurant") {
      return <RestaurantNavigator />;
    }
    if (account === "user") {
      return <UserNavigator />;
    } else {
      return <UserNavigator />;
    }
  }
};
