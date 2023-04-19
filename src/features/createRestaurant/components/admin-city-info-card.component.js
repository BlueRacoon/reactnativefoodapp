/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Colors, Switch } from "react-native-paper";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { AdminContainer } from "../../account/components/account.styles";
import {
  Hours,
  RestaurantCard,
  Info,
  Section,
  SwitchButtonContainer,
  UseSwitch,
} from "../../restaurants/components/restaurant-info-card.styles";
import { Update } from "./adminCityCrudFunctions.component";

export const AdminCityInfoCard = (props) => {
  const [isShowingVar, setIsShowingVar] = useState(props.cityShowing);

  useEffect(() => {
    setIsShowingVar(props.cityShowing);
  }, [props.cityShowing]);

  return (
    <>
      <RestaurantCard elevation={3} style={{ width: "100%", borderRadius: 20 }}>
        <Info>
          <AdminContainer>
            <SwitchButtonContainer>
              <Text variant="label" style={{ flexWrap: "wrap" }}>
                {props.cityName}
              </Text>
              <Section>
                <Spacer size="small"></Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              {/* <Text>Close/Open</Text>
              <Switch
                onChange={() => {
                  Update(
                    {
                      isOpen: !isOpenVar,
                    },
                    true,
                    props.name
                    // ,
                    // restaurant.name
                  ),
                    setIsOpenVar(!isOpenVar);
                }}
                value={isOpenVar}
              /> */}
            </SwitchButtonContainer>
            <SwitchButtonContainer>
              <Text>Hide/Show</Text>
              <Switch
                onChange={() => {
                  Update(
                    {
                      cityShowing: !isShowingVar,
                    },
                    true,
                    props.cityName
                    // ,
                    // restaurant.name
                  ),
                    setIsShowingVar(!isShowingVar);
                }}
                value={isShowingVar}
              />
            </SwitchButtonContainer>
          </AdminContainer>
        </Info>
      </RestaurantCard>
    </>
  );
};
