/* eslint-disable prettier/prettier */
import React, { useContext, useState } from "react";
import { Switch } from "react-native-paper";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { RestaurantBackendContext } from "../../../services/restaurant-backend/restaurant-backend.context";
import { ToggleUpdatingIndicator } from "../../cart/components/cart.styles";
import { SwitchButtonContainer } from "../../restaurants/components/restaurant-info-card.styles";
import { UpdateRestaurantStatus } from "./update-restaurant-status.service";

export const OffOnButton = (props) => {
  const { localData, day } = useContext(RestaurantBackendContext);
  const [offOnStatus, setOffOnStatus] = useState(localData.isOpen);
  const [localOnOffStatus, setLocalOnOffStatus] = useState(localData.isOpen);
  const [using, setUsing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SwitchButtonContainer>
      {isLoading && <ToggleUpdatingIndicator />}
      <Text style={{ flexWrap: "wrap", fontSize: 20 }}>off / on</Text>
      <Spacer />
      <Switch
        disabled={using}
        color="#99FF99"
        onChange={() => {
          setUsing(true),
            setIsLoading(true),
            UpdateRestaurantStatus(localData.name, !offOnStatus).then(() => {
              setOffOnStatus(!offOnStatus),
                setIsLoading(false),
                setUsing(false);
              //   setIsLoading(false);
            });
        }}
        value={offOnStatus}
      />
    </SwitchButtonContainer>
  );
};
