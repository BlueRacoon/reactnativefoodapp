/* eslint-disable prettier/prettier */

import React from "react";
import { FlatList } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";
import styled from "styled-components/native";

export const RestaurantList = styled(FlatList).attrs({
  contentContainerStyle: {
    // paddingBottom: "100%",
    padding: 16,
  },
})`
  height: auto;
`;

export const OrderButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[2]};
  width: 80%;
  align-self: center;
`;
