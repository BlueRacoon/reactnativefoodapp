/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RestaurantsSettingsNavigator } from "./restaurants-settings.navigator";

import { OrdersNavigator } from "./orders.navigator";

import { useContext, useEffect, useRef, useState } from "react";
import { SalesScreen } from "../../features/sales/screens/sales.screen";
import { ReservationScreen } from "../../features/reservations/screens/reservation.screen";
import { OrdersContext } from "../../services/orders/orders.context";

import { colors } from "../../infrastructure/theme/colors";
import { Dimensions } from "react-native";
import { Audio } from "expo-av";

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get("window");

let aspectRatio = height / width;

const TAB_ICON = {
  Orders: "receipt",
  Reservations: "list",
  Sales: "bar-chart",
  "Restaurant Settings": "md-settings",
};

aspectRatio < 1 || !aspectRatio || typeof aspectRatio === "undefined"
  ? (aspectRatio = 1.5)
  : null;

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarStyle: { height: aspectRatio * height * 0.0475 },
    headerShown: false,
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    tabBarActiveTintColor: colors.brand.primary,
    tabBarInactiveTintColor: colors.brand.muted,
  };
};

export const RestaurantNavigator = () => {
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [tabMargin, setTabMargin] = useState(2);
  const { liveOrder } = useContext(OrdersContext);

  const orderCount = useRef(0);

  // console.log(aspectRatio);

  useEffect(() => {
    if (aspectRatio < 1.5) {
      setTabMargin(8);
    }
  }, []);

  //Sound stuff

  const [sound, setSound] = useState(null);

  async function playSound() {
    // console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./../../../assets/new-order.mp3")
    );
    setSound(sound);

    // console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          // console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  //LIVE ORDER effect

  useEffect(() => {
    let count = 0;
    let end = liveOrder.length - 1;
    // console.log(end);
    Object.keys(liveOrder).map((order) => {
      // console.log("order", order);
      // console.log("end", end);
      if (liveOrder[order].value.status === "new") {
        count++;
      }
      if (parseFloat(order) === parseFloat(end)) {
        // console.log("orderCount.current: ", orderCount.current);
        // console.log("count: ", count);
        if (orderCount.current < count) {
          orderCount.current = count;
          playSound();
        } else {
          orderCount.current = count;
        }
        setNewOrderCount(count);
        return;
      }
    });
  }, [liveOrder]);

  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          tabBarBadge: newOrderCount > 9 ? "9+" : newOrderCount,
          tabBarBadgeStyle: {
            backgroundColor: "#BF1F2E",
            marginTop: tabMargin,
            fontSize: 9,
            lineHeight: 14,
            minWidth: 14,
            minHeight: 14,
            maxWidth: 20,
            maxHeight: 14,
            borderRadius: 7,
          },
        }}
      />
      <Tab.Screen name="Reservations" component={ReservationScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen
        name="Restaurant Settings"
        component={RestaurantsSettingsNavigator}
        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};
