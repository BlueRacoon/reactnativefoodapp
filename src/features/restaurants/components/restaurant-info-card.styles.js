/* eslint-disable prettier/prettier */
import styled from "styled-components/native";
import { ActivityIndicator, Card } from "react-native-paper";
import { Switch } from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";

export const Icon = styled.Image`
  width: 15px;
  height: 15px;
`;

export const Address = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;
export const Hours = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;
export const MenuName = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.body};
`;

export const Section = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SectionEnd = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const RestaurantCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 95%;
  align-self: center;
`;

export const RestaurantCardMainScreen = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  height: auto;
  width: 95%;
  align-self: center;
  max-width: 400px;
`;

export const MenuCategoryCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 95%;
  align-self: center;
`;
export const PickupCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 100%;
  align-self: center;
`;

export const UseSwitch = styled(Switch)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const RestaurantCardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[0]};
  background-color: ${(props) => props.theme.colors.bg.primary};
  margin-horizontal: ${(props) => props.theme.space[2]};
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[0]};
  border-radius: 5px;
  display: flex;
`;

export const Info = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;

export const SwitchButtonContainer = styled.View`
  padding: ${(props) => props.theme.space[0]};
  flex-wrap: wrap;
  flex-direction: column;
  min-width: 100;
`;

export const Rating = styled.View`
  flex-direction: row;
  padding-top: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[2]};
`;

export const Loading = styled(ActivityIndicator).attrs({
  size: 75,
  animating: true,
  color: colors.brand.secondary,
})`
  margin-left: -25px;
`;

export const LoadingContainer = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
`;
