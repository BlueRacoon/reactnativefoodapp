/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";

import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";

import {
  AdminContainer,
  MenuModifyButton,
} from "../../account/components/account.styles";

import {
  MenuName,
  RestaurantCard,
  Info,
  Section,
  SwitchButtonContainer,
} from "../../restaurants/components/restaurant-info-card.styles";

import { ActivityIndicator, Alert } from "react-native";
import { db } from "../../../../App";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components/native";
import { colors } from "../../../infrastructure/theme/colors";

export const RestaurantMenuInfoCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const PaymentProcessing = styled(ActivityIndicator).attrs({
    size: 60,
    animating: true,
    color: colors.brand.secondary,
  })`
    position: absolute;
    top: 25%;
    left: 38%;
    z-index: 999;
  `;

  const twoButtonAlert = () => {
    Alert.alert("Action", "Are you sure you want to delete this menu?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          setIsLoading(true);
          const docRef = doc(db, "restaurants", props.rest);
          try {
            updateDoc(docRef, {
              [`menus.${props.name}`]: deleteField(),
            }).then(() => {
              setIsLoading(false);
              Alert.alert("Menu deleted!");
              return;
            });
          } catch (e) {
            setIsLoading(false);
            Alert.alert("Issue removing menu");
            return;
          }
        },
      },
    ]);
  };

  return (
    <>
      <RestaurantCard elevation={3} style={{ width: "100%", borderRadius: 10 }}>
        {isLoading && <PaymentProcessing />}
        <Info>
          <AdminContainer>
            <SwitchButtonContainer>
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Menu name:
              </Text>
              <Section>
                <Spacer size="small">
                  <MenuName>{props.name}</MenuName>
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            {/* <SwitchButtonContainer>
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Show/Hide
              </Text>
              <Spacer />
              <Switch
                // onChange={() => {
                //   Update(
                //     {
                //       isOpen: !isOpenVar,
                //     },
                //     true,
                //     props.name
                //     // ,
                //     // restaurant.name
                //   ),
                //     setIsOpenVar(!isOpenVar);
                // }}
                value={false}
              />
            </SwitchButtonContainer> */}
            <SwitchButtonContainer style={{ justifyContent: "center" }}>
              <MenuModifyButton mode="contained" onPress={twoButtonAlert}>
                Delete
              </MenuModifyButton>
            </SwitchButtonContainer>
          </AdminContainer>
        </Info>
      </RestaurantCard>
    </>
  );
};
