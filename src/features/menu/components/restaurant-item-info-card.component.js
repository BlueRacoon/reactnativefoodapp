/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Searchbar,
  Switch,
} from "react-native-paper";

import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";

import {
  AdminContainer,
  DropDownContainer,
  MenuModifyButton,
  RestModifyButton,
} from "../../account/components/account.styles";

import {
  MenuName,
  RestaurantCard,
  Info,
  Section,
  SwitchButtonContainer,
} from "../../restaurants/components/restaurant-info-card.styles";

import { Alert } from "react-native";
import { db } from "../../../../App";
import {
  arrayRemove,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import {
  UpdateItemAvailable,
  UpdateItemShowing,
} from "./StoreCrudFunctions.component";
import { Search } from "../../restaurants/components/search.component";
import styled from "styled-components/native";
import { colors } from "../../../infrastructure/theme/colors";

export const PaymentProcessing = styled(ActivityIndicator).attrs({
  size: 60,
  animating: true,
  color: colors.brand.secondary,
})`
  position: absolute;
  top: 25%;
  left: 38%;
  z-index: 999;
`;

export const MenuItemInfoCard = (props) => {
  const manipulatedProps = props;

  // console.log(manipulatedProps);

  //DO NOT REMOVE - exceptBoth is used in update functions
  const { catUsed, menuUsed, rest, navigation, ...exceptBoth } =
    manipulatedProps;
  const [isLoading, setIsLoading] = useState(false);
  const [disabledAvailable, setDisabledAvailable] = useState(false);
  const [disabledhide, setDisabledhide] = useState(false);

  // USE ~exceptboth~ TO DELETE THE PASSED IN ITEM OBJECT ~

  // console.log(exceptBoth);

  // console.log(props.menuUsed);
  // console.log(props.properties);
  // console.log(props.menus.lunch.properties);
  // console.log(props.index);
  // console.log(props);
  // const props.= ({
  //   name: { ...props.name },
  //   isOpen: { ...props.isOpen },
  //   isShowing: { ...props.isShowing },
  //   hours: { ...props.hours.mon },
  // } = { ...props });

  // const restaurant = { props.name, isOpen, isShowing, hours = null } = ;

  // const [isOpenVar, setIsOpenVar] = useState(props.isOpen);
  const [isShowingVar, setIsShowingVar] = useState(props.isShowing);

  const [isAvailableVar, setIsAvailableVar] = useState(props.isAvailable);

  // const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

  useEffect(() => {
    setIsShowingVar(props.isShowing);
  }, [props.isShowing]);

  useEffect(() => {
    setIsAvailableVar(props.isAvailable);
  }, [props.isAvailable]);

  const updateExceptBoth = () => {
    exceptBoth.isShowing = isShowingVar;
    exceptBoth.isAvailable = isAvailableVar;
  };

  const twoButtonAlert = () => {
    Alert.alert("Action", "Are you sure you want to delete this menu item?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          setDisabledhide(true);
          setIsLoading(true);
          const removeProperty = doc(db, "restaurants", props.rest);
          exceptBoth.isShowing = isShowingVar;
          exceptBoth.isAvailable = isAvailableVar;

          setDoc(
            removeProperty,
            {
              menus: {
                [props.menuUsed]: {
                  [props.catUsed]: arrayRemove(exceptBoth),
                },
              },
            },
            { merge: true }
          )
            .then(() => {
              setIsLoading(false);
              Alert.alert("Menu item deleted! Please refresh");
            })
            .catch((error) => {
              setDisabledhide(true);
              setIsLoading(false);
              alert("Could not complete update");
            });
        },
      },
    ]);
  };

  return (
    <>
      <RestaurantCard
        elevation={3}
        style={{ width: "100%", borderRadius: 10, minWidth: "75%" }}
      >
        {isLoading && <PaymentProcessing />}
        <Info>
          <AdminContainer>
            <SwitchButtonContainer
              style={{ flexWrap: "wrap", width: "30%", paddingRight: 5 }}
            >
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Item:
              </Text>
              <Section style={{ maxWidth: "95%" }}>
                <Spacer size="small">
                  <MenuName style={{ maxWidth: "100%" }}>{props.name}</MenuName>
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              <Text
                variant="label"
                style={{ flexWrap: "wrap", maxWidth: "95%" }}
              >
                Hide / Show
              </Text>
              <Spacer />
              <Switch
                disabled={disabledhide}
                onChange={() => {
                  setDisabledhide(true),
                    setIsLoading(true),
                    updateExceptBoth(),
                    UpdateItemShowing(
                      true,
                      props.rest,
                      props.menuUsed,
                      props.catUsed,
                      isShowingVar,
                      exceptBoth
                    ).then(() => {
                      setIsLoading(false), setDisabledhide(false);
                    }),
                    setIsShowingVar(!isShowingVar),
                    updateExceptBoth();
                  // console.log(isShowingVar);
                }}
                value={isShowingVar}
              />
            </SwitchButtonContainer>
            <SwitchButtonContainer>
              <Text
                variant="label"
                style={{ flexWrap: "wrap", maxWidth: "95%" }}
              >
                86 / Available
              </Text>
              <Spacer />
              <Switch
                disabled={disabledhide}
                onChange={() => {
                  setDisabledhide(true),
                    setIsLoading(true),
                    updateExceptBoth(),
                    UpdateItemAvailable(
                      true,
                      props.rest,
                      props.menuUsed,
                      props.catUsed,
                      isAvailableVar,
                      exceptBoth
                    ).then(() => {
                      setIsLoading(false), setDisabledhide(false);
                    }),
                    setIsAvailableVar(!isAvailableVar),
                    updateExceptBoth();
                }}
                value={isAvailableVar}
              />
            </SwitchButtonContainer>
          </AdminContainer>
          <Spacer size="large" />
          <AdminContainer>
            <MenuModifyButton
              mode="contained"
              onPress={twoButtonAlert}
              disabled={disabledhide}
            >
              Delete
            </MenuModifyButton>
            <MenuModifyButton
              mode="contained"
              disabled={disabledhide}
              onPress={() =>
                navigation.navigate("Edit Menu Item", {
                  props,
                  isShowingVar,
                  isAvailableVar,
                })
              }
            >
              Edit
            </MenuModifyButton>
          </AdminContainer>
        </Info>
      </RestaurantCard>
    </>
  );
};
