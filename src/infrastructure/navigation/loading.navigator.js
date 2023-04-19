/* eslint-disable prettier/prettier */
import React from "react";
import { Dimensions, View } from "react-native";
import styled from "styled-components/native";
import { Spacer } from "../../components/spacer/spacer.component";
import { Text } from "../../components/typography/text.component";
import { SafeArea } from "../../components/utils/safe-area.component";
import { colors } from "../theme/colors";

const { width, height } = Dimensions.get("window");

const LoadingImage = styled.ImageBackground.attrs({
  source: require("../../../assets/splashscreenAM.png"),
})`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;
export const LoadingScreen = () => {
  return (
    <>
      <SafeArea>
        <LoadingImage />
      </SafeArea>
    </>
  );
};
