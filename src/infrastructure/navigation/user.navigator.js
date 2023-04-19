/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RestaurantsNavigator } from "./restaurants.navigator";
import { SettingsNavigator } from "./settings.navigator";
import { MapScreen } from "../../features/map/screens/map.screen";
import { ViewOrdersScreen } from "../../features/orders/screens/view-orders.screen";
import { CartNavigator } from "./cart.navigator";
import { colors } from "../../infrastructure/theme/colors";
import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from "react";
import { OrdersContext } from "../../services/orders/orders.context";
import { CartContext } from "../../services/cart/cart.context";
import { OrderMapScreen } from "../../features/map/screens/order-map.screen";
import { Dimensions } from "react-native";

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get("window");

let aspectRatio = height / width;

const TAB_ICON = {
  Restaurants: "md-restaurant",
  Cart: "md-cart",
  Map: "md-map",
  UserSettings: "md-settings",
  "Track Order": "time",
};

//checks for aspectRatio not loading in
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

const createSecondScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];

  return {
    tabBarStyle: { height: aspectRatio * height * 0.0475 },
    headerShown: false,
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    initialRouteName: "Track Order",
    tabBarActiveTintColor: colors.brand.primary,
    tabBarInactiveTintColor: colors.brand.muted,
  };
};

export const UserNavigator = () => {
  const { liveOrder } = useContext(OrdersContext);
  const { cart } = useContext(CartContext);
  const [trackChange, setTrackChange] = useState("!");
  const [tabMargin, setTabMargin] = useState(5);

  const orderStatus = useRef(liveOrder);

  // liveOrder.hasOwnProperty("value")
  //   ? console.log("liveOrder navigator: ", liveOrder.value.number)
  //   : console.log("no order: ", liveOrder);

  useEffect(() => {
    if (orderStatus !== liveOrder) {
      setTrackChange("!");
    }
  }, [liveOrder]);

  useEffect(() => {
    if (aspectRatio < 1.5) {
      setTabMargin(8);
    }
  }, []);

  if (Object.keys(liveOrder).length !== 0) {
    if (liveOrder.value.status !== "completed") {
      return (
        <Tab.Navigator
          initialRouteName="Track Order"
          screenOptions={createSecondScreenOptions}
          listeners={() => ({
            tabPress: (e) => {
              setTrackChange(null);
            },
          })}
          options={{
            tabBarBadge: trackChange,
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
        >
          <Tab.Screen
            name="Track Order"
            component={ViewOrdersScreen}
            listeners={() => ({
              tabPress: (e) => {
                setTrackChange(null);
              },
            })}
            options={{
              tabBarBadge: trackChange,
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
          <Tab.Screen name="Map" component={OrderMapScreen} />
          <Tab.Screen
            name="UserSettings"
            component={SettingsNavigator}
            options={{
              title: "Settings",
            }}
          />
        </Tab.Navigator>
      );
    } else {
      return (
        <Tab.Navigator screenOptions={createScreenOptions}>
          <Tab.Screen name="Restaurants" component={RestaurantsNavigator} />
          <Tab.Screen
            name="Cart"
            component={CartNavigator}
            options={{
              tabBarBadge: cart.length > 9 ? "9+" : cart.length,
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
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen
            name="UserSettings"
            component={SettingsNavigator}
            options={{
              title: "Settings",
            }}
          />
        </Tab.Navigator>
      );
    }
  } else {
    return (
      <Tab.Navigator screenOptions={createScreenOptions}>
        <Tab.Screen name="Restaurants" component={RestaurantsNavigator} />
        <Tab.Screen
          name="Cart"
          component={CartNavigator}
          options={{
            tabBarBadge: cart.length > 9 ? "9+" : cart.length,
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
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen
          name="UserSettings"
          component={SettingsNavigator}
          options={{
            title: "Settings",
          }}
        />
      </Tab.Navigator>
    );
  }
};
