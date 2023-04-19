/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import {
  Button,
  Searchbar,
  Switch,
  ActivityIndicator,
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
import { UpdateCat } from "./StoreCrudFunctions.component";
import styled from "styled-components/native";
import { colors } from "../../../infrastructure/theme/colors";

export const CategoryMenuInfoCard = (props) => {
  // console.log(props.menuUsed);

  const [isShowingVar, setIsShowingVar] = useState(props.isShowing);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledhide, setDisabledhide] = useState(false);

  const cat = props.label;
  const initialSwitch = props.properties?.find(({ name }) => name === cat);
  // const indexSwitch = props.properties?.indexOf(initialSwitch);

  useEffect(() => {
    if (initialSwitch) {
      setIsShowingVar(initialSwitch.isShowing);
    }
  }, [initialSwitch]);

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
    Alert.alert("Action", "Are you sure you want to delete this category?", [
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
          updateDoc(docRef, {
            [`menus.${props.menuUsed}.${props.label}`]: deleteField(),
          });

          const oldValue = {
            name: props.label,
            isShowing: isShowingVar,
          };
          const removeProperty = doc(db, "restaurants", props.rest);
          // console.log(oldValue);

          setDoc(
            removeProperty,
            {
              menus: {
                [props.menuUsed]: {
                  properties: arrayRemove(oldValue),
                },
              },
            },
            { merge: true }
          )
            .then(() => {
              setIsLoading(false);
              Alert.alert("Category deleted! Press pick menu to refresh.");
            })
            .catch((error) => {
              setIsLoading(false), Alert.alert("Could not update");
            });
        },
      },
    ]);
  };

  const updateCatFunction = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await UpdateCat(
          true,
          props.rest,
          props.menuUsed,
          props.label,
          isShowingVar
        ).then(() => {
          resolve(true);
        });
      } catch (e) {
        console.log("resolving false");
        resolve(false);
      }
    });
  };

  return (
    <>
      <RestaurantCard elevation={3} style={{ width: "100%", borderRadius: 10 }}>
        {isLoading && <PaymentProcessing />}
        <Info>
          <AdminContainer>
            <SwitchButtonContainer>
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Cat:
              </Text>
              <Section>
                <Spacer size="small">
                  <MenuName>{props.label}</MenuName>
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                Hide/Show
              </Text>
              <Spacer />
              <Switch
                disabled={disabledhide}
                onChange={() => {
                  setIsShowingVar(!isShowingVar);
                  setDisabledhide(true);
                  setIsLoading(true);
                  updateCatFunction().then((res) => {
                    if (res === true) {
                      setIsLoading(false);
                      setDisabledhide(false);
                    } else {
                      setIsLoading(false);
                      setDisabledhide(false);
                      setIsShowingVar(!isShowingVar);
                      Alert.alert("Error");
                    }
                  });
                }}
                value={isShowingVar}
              />
            </SwitchButtonContainer>
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
