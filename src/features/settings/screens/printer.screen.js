/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
// import {
//   StarDeviceDiscoveryManager,
//   StarDeviceDiscoveryManagerFactory,
//   InterfaceType,
//   StarPrinter,
// } from "react-native-star-io10";

const NoFavoritesArea = styled(SafeArea)`
  align-items: center;
  justify-content: center;
`;

// let manager = StarDeviceDiscoveryManager;
// console.log(manager);

export const PrinterScreen = ({ navigation }) => {
  return (
    <SafeArea>
      <Text>This is the printer screen</Text>
    </SafeArea>
  );
};
