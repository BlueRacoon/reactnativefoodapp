/* eslint-disable prettier/prettier */
import React from "react";
import { View } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  AccountBackground,
  AccountContainer,
  AccountCover,
  AuthButton,
  AnimationWrapper,
} from "../components/account.styles";
import LottieView from "lottie-react-native";
import styled from "styled-components/native";

export const AccountTitle = styled.Text`
  font-family: ${(props) => props.theme.fonts.monospace};
  font-size: ${(props) => props.theme.fontSizes.h4};
`;

export const AccountScreen = ({ navigation }) => {
  return (
    <AccountBackground>
      <AccountCover />
      <AnimationWrapper>
        <LottieView
          key="animation"
          autoPlay
          loop
          // resizeMode="cover"
          resizeMode="contain"
          source={require("../../../../assets/AppyMealLottieFile.json")}
        />
      </AnimationWrapper>

      <AccountTitle>AppyMeal</AccountTitle>
      <AccountContainer>
        <AuthButton
          icon="lock-open-outline"
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </AuthButton>
        <Spacer size="large">
          <AuthButton
            icon="email"
            mode="contained"
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </AuthButton>
        </Spacer>
      </AccountContainer>
    </AccountBackground>
  );
};
