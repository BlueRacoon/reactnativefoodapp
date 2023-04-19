/* eslint-disable prettier/prettier */
import React from "react";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { CartIconContainer, CartIcon } from "../components/cart.styles";
import { colors } from "../../../infrastructure/theme/colors";

export const CartErrorScreen = ({ route }) => {
  const { error = "" } = route.params;
  return (
    <SafeArea>
      <CartIconContainer>
        <CartIcon icon="close" bg={colors.ui.error} />
        <Spacer size="large" />
        <Text variant="label">{error}</Text>
      </CartIconContainer>
    </SafeArea>
  );
};
