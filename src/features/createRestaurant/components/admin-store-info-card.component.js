/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from "react";
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
import { Update } from "./adminStoreCrudFunctions.component";

export const AdminStoreInfoCard = (props) => {
  // console.log(props);

  const [isOpenVar, setIsOpenVar] = useState(props.isOpen);
  const [isShowingVar, setIsShowingVar] = useState(props.isShowing);
  const [day, setDay] = useState(null);
  // const useMemo(weekday) = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];

  const weekday = useMemo(
    () => ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"],
    []
  );

  useEffect(() => {
    setIsOpenVar(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    setIsShowingVar(props.isShowing);
  }, [props.isShowing]);

  useEffect(() => {
    var b = new Date();
    b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
    setDay(weekday[b.getDay()]);
  }, [weekday]);

  return (
    <>
      <RestaurantCard elevation={3} style={{ width: "100%", borderRadius: 10 }}>
        <Info>
          <AdminContainer>
            <SwitchButtonContainer>
              <Text
                variant="label"
                style={{ flexWrap: "wrap", paddingRight: 5, maxWidth: "95%" }}
              >
                {props.name}
              </Text>
              <Section>
                <Spacer size="small">
                  {day && (
                    <>
                      <Hours>{props.hours[day].time}</Hours>
                    </>
                  )}
                </Spacer>
              </Section>
            </SwitchButtonContainer>

            <SwitchButtonContainer>
              <Text>Close/Open</Text>
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
              />
            </SwitchButtonContainer>
            <SwitchButtonContainer>
              <Text>Hide/Show</Text>
              <Switch
                onChange={() => {
                  Update(
                    {
                      isShowing: !isShowingVar,
                    },
                    true,
                    props.name
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
