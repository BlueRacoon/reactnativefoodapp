/* eslint-disable prettier/prettier */
import React from "react";
import { CompactRestaurantInfo } from "../../../components/restaurant/Compact-restaurant-info.component";

export const MapCallout = ({ restaurant }) => {
  return <CompactRestaurantInfo isMap restaurant={restaurant} />;
};
