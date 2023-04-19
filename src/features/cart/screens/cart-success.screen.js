/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { CartIconContainer, CartIcon } from "../components/cart.styles";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { OrderButton } from "../../restaurants/components/restaurant-list.styles";
import { OrdersContext } from "../../../services/orders/orders.context";

export const CartSuccessScreen = () => {
  return (
    <SafeArea>
      <CartIconContainer>
        <CartIcon icon="check-bold" />
        <Spacer size="large" />
        <Text variant="label">Success!</Text>
      </CartIconContainer>
      <Spacer size="xl" />
    </SafeArea>
  );
};
