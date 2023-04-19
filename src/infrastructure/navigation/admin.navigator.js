/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { CreateRestaurantScreen } from "../../features/createRestaurant/screens/createRestaurant.screen";
import { SalesScreen } from "../../features/sales/screens/sales.screen";
import { UsersScreen } from "../../features/users/screens/users.screen";
import { SettingsAdminNavigator } from "./settings-admin.navigator";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Create: "md-restaurant",
  Sales: "bar-chart",
  Users: "person",
  "Admin Settings": "md-settings",
};

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    headerShown: false,
    tabBarIcon: ({ size, color }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
    tabBarActiveTintColor: "tomato",
    tabBarInactiveTintColor: "gray",
  };
};

export const AdminNavigator = () => {
  return (
    <Tab.Navigator screenOptions={createScreenOptions}>
      <Tab.Screen name="Create" component={CreateRestaurantScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen
        name="Admin Settings"
        component={SettingsAdminNavigator}
        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};
