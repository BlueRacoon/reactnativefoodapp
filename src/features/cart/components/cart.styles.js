/* eslint-disable prettier/prettier */
import React from "react";
import styled from "styled-components/native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  TextInput,
  Colors,
} from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";
import { View, StatusBar, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const CartIconContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const PaymentProcessing = styled(ActivityIndicator).attrs({
  size: 128,
  animating: true,
  color: colors.brand.secondary,
})`
  ${
    "" /* position: absolute;
  top: 50%;
  left: 35%; */
  }
  padding-top: 40%;
  z-index: 999;
`;

export const CartPaymentProcessing = styled(ActivityIndicator).attrs({
  size: 128,
  animating: true,
  color: colors.brand.secondary,
})`
  position: absolute;
  top: 50%;
  z-index: 999;
`;

export const UpdatingIndicator = styled(ActivityIndicator).attrs({
  size: 128,
  animating: true,
  color: colors.brand.secondary,
})`
  position: absolute;
  top: 50%;
  left: 35%;
  z-index: 999;
`;

export const ImageIndicator = styled(ActivityIndicator).attrs({
  size: 128,
  animating: true,
  color: colors.brand.secondary,
})`
  z-index: 999;
`;

export const ToggleUpdatingIndicator = styled(ActivityIndicator).attrs({
  size: 90,
  animating: true,
  color: colors.brand.secondary,
})`
  position: absolute;
  top: 10%;
  right: 25%;
  z-index: 999;
`;

export const UpdateAddressIndicator = styled(ActivityIndicator).attrs({
  size: 90,
  animating: true,
  color: colors.brand.secondary,
})`
  position: absolute;
  top: 100%;
  z-index: 999;
`;

export const CartIcon = styled(Avatar.Icon).attrs({
  size: 128,
})`
  background-color: ${(props) => props.bg || props.theme.colors.brand.primary};
`;

export const NameInput = styled(TextInput).attrs({
  color: colors.brand.primary,
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[2]};
  margin-right: ${(props) => props.theme.space[3]};
  margin-left: ${(props) => props.theme.space[3]};
  underlinecolor: green;
`;

export const EmailInput = styled(TextInput).attrs({
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[2]};
  margin-right: ${(props) => props.theme.space[3]};
  margin-left: ${(props) => props.theme.space[3]};
`;

export const PayButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  width: 80%;
  align-self: center;
  padding: ${(props) => props.theme.space[2]};
`;

export const ClearButton = styled(Button).attrs({
  color: "white",
})`
  width: 80%;
  align-self: center;
  padding: ${(props) => props.theme.space[2]};
`;
