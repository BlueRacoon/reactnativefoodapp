/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from "react";
import { Dimensions, View } from "react-native";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import {
  ComingSoonButton,
  ComingSoonView,
  ModifyItemTitle,
} from "../../account/components/account.styles";

const { width, height } = Dimensions.get("window");

export const ReservationScreen = () => {
  return (
    <SafeArea>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton labelStyle={{ fontSize: 16 }} type="text" />
      </ComingSoonView>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton labelStyle={{ fontSize: 16 }} type="text" />
      </ComingSoonView>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton labelStyle={{ fontSize: 16 }} type="text">
          Coming Soon
        </ComingSoonButton>
      </ComingSoonView>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton
          labelStyle={{ fontSize: 16 }}
          type="text"
        ></ComingSoonButton>
      </ComingSoonView>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton labelStyle={{ fontSize: 16 }} type="text" />
      </ComingSoonView>
      <ComingSoonView stlye={{ paddingheight: height }}>
        <ComingSoonButton labelStyle={{ fontSize: 16 }} type="text" />
      </ComingSoonView>
    </SafeArea>
  );
};
