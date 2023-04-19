/* eslint-disable prettier/prettier */
import styled from "styled-components/native";
import { colors } from "../../../infrastructure/theme/colors";
import { Button, RadioButton, Text, TextInput } from "react-native-paper";
import { ActivityIndicator, Colors } from "react-native-paper";
import MapView from "react-native-maps";

export const AccountBackground = styled.ImageBackground.attrs({
  source: require("../../../../assets/home_bg.jpg"),
})`
  flex: 1;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
`;

export const EditBackground = styled.View.attrs({})`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

export const MenuItemBackground = styled.View`
  flex: 1;
  width: 100%;
  background-color: #ddd;
  align-items: center;
  justify-content: center;
`;

export const AccountCover = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.25);
`;

export const MapBottomTextContainer = styled.View`
  margin-top: 2%;
  margin-right: 2.5%;
  margin-left: 2.5%;
  margin-bottom: 0%;
  background-color: #f1f1f1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 2.5%;
  padding-vertical: 5;
  border-radius: 5;
`;

export const MapBottomContainer = styled.View`
  position: absolute;
  bottom: 4%;
  height: 11.25%;
  width: 95%;
  margin-horizontal: 2.5%;
  border-top-end-radius: 5;
  border-top-start-radius: 5;
  border-bottom-start-radius: 5;
  border-bottom-end-radius: 5;
  background-color: white;
  zindex: 5;
`;

export const MapTopTextContainer = styled.View`
  margin-top: 2.5%;
  margin-bottom: 2.5%;
  margin-left: 2.5%;
  background-color: #f1f1f1;
  align-items: center;
  padding-right: 2.5%;
  padding-left: 6%;
  padding-vertical: 9;
  border-radius: 5;
`;

export const MapTopContainer = styled.View`
  position: absolute;
  top: 50;
  right: 0;
  height: 50;
  max-width: 95%;
  margin-left: 2.5%;
  border-radius: 5;
  background-color: white;
  justify-content: center;
  alignitems: center;
  zindex: 5;
`;

export const MapTopLeftContainer = styled.View`
  position: absolute;
  flex-direction: row;
  justifycontent: center;
  alignitems: center;
  top: 60;
  left: 20;
  height: 50;
  max-width: 100%;
  margin-left: 2.5%;
  border-radius: 5;
  ${"" /* background-color: white; */}
  justify-content: center;
  alignitems: center;
  zindex: 5;
`;

export const AccountContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.6);

  padding: ${(props) => props.theme.space[4]};
  margin-top: ${(props) => props.theme.space[2]};
`;

export const EditItemContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.6);
  padding: ${(props) => props.theme.space[4]};
  margin-top: ${(props) => props.theme.space[2]};
  justify-content: center;
`;

export const LocationAccountContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.6);

  padding: ${(props) => props.theme.space[4]};
  margin-top: ${(props) => props.theme.space[2]};
  width: 100%;
`;

export const SmallAccountContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.6);

  padding-top: ${(props) => props.theme.space[0]};
  padding-bottom: ${(props) => props.theme.space[3]};
  padding-horizontal: ${(props) => props.theme.space[4]};

  width: 100%;
`;

export const ForgotPass = styled.View`
  align-items: center;
  justify-content: center;
`;

export const AuthButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[2]};
`;

export const AdminButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 30%;
`;

export const CreateButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 43%;
`;

export const DetailButton = styled(Button).attrs({
  color: "white",
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};
  color: ${(props) => props.theme.colors.brand.primary};
  width: 43%;
`;

export const HoursButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 32%;
`;

export const ScheduleButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 55%;
`;

export const AdminModifyButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 30%;
`;

export const AdminCreateModifyButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 46%;
`;

export const RestModifyButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[1]};
  padding-bottom: ${(props) => props.theme.space[1]};

  width: 30%;
`;

export const MenuModifyButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[0]};
  padding-bottom: ${(props) => props.theme.space[0]};
  borderradius: 50px;
  width: 96px;
`;

export const MenuModifyItemButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  padding-top: ${(props) => props.theme.space[0]};
  padding-bottom: ${(props) => props.theme.space[0]};
  borderradius: 50px;
  width: 96px;
`;

export const AdminContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

export const AdminEditContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const HourScreenWrapper = styled.View`
  height: 100%;
  width: 100%;
`;

export const MenuItemContainerName = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
export const CheckoutContainerName = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const MenuItemContainer = styled.View`
  padding: 35px;
`;
export const CartFullContainer = styled.View``;
export const MenuTitleContainer = styled.View`
  align-items: center;
  justify-content: space-around;
  padding: 15px;
`;

export const DropDownContainer = styled.View`
  zindex: 1000px;
  width: 300px;
`;
export const MenuItemDropDownContainer = styled.View`
  zindex: 1000px;
  width: 100%;
`;

export const AuthInput = styled(TextInput).attrs({
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  width: 300px;
`;

export const OptionInput = styled(TextInput).attrs({
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  margin-left: 30px;
  width: 250px;
`;

export const EditOptionInput = styled(TextInput).attrs({
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  width: 250px;
`;
export const OptionPriceInput = styled(TextInput).attrs({
  selectionColor: colors.brand.primary,
  activeUnderlineColor: colors.brand.muted,
})`
  margin-left: 30px;
  width: 230px;
`;

export const Title = styled(Text)`
  font-size: 30px;
  font-family: ${(props) => props.theme.fonts.body};
`;
export const MenuItemText = styled(Text)`
  font-size: 19px;
  font-family: ${(props) => props.theme.fonts.body};
`;

export const SelectionRequiredText = styled(Text)`
  font-size: 15px;
  font-family: ${(props) => props.theme.fonts.body};
`;
export const RawWarningMenuItemText = styled(Text)`
  font-size: 12px;
  width: 100%
  font-family: ${(props) => props.theme.fonts.heading};
`;

export const ErrorContainer = styled.View`
  max-width: 300px;
  align-items: center;
  align-self: center;
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[2]};
`;

export const AnimationWrapper = styled.View`
  width: 100%;
  height: 34%;
  position: absolute;
  top: 12px;
  padding: ${(props) => props.theme.space[1]};
`;

export const RadioInput = styled(RadioButton)`
  width: 300px;
  backgroundcolor: green;
`;

export const MenuItemTitleContainer = styled.View`
  width: 100%;
  background-color: ${(props) => props.theme.colors.brand.primary};
  align-items: center;
  justify-content: space-around;
  padding: 5px;
  zindex: 1px;
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

const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`;

export const OrderTitleContainer = styled.ImageBackground.attrs({
  source: require("../../../../assets/darkbackgroundtop.png"),
})`
  margin-top: 0;
  width: 100%;
  align-items: center;
  padding-bottom: 5px;
  padding-top: 5px;
  zindex: 999px;
`;

export const ComingSoonView = styled.ImageBackground.attrs({
  source: require("../../../../assets/darkbackgroundtop.png"),
})`
  width: 100%;
  align-items: center;
  padding-bottom: 5px;
  padding-top: 5px;
  zindex: 0px;
`;

export const ModifyItemTitle = styled(Button).attrs({
  color: "white",
  fontWeight: "bold",
})`
  padding: ${(props) => props.theme.space[3]};
  width: 100%;
  align-self: center;
  zindex: 1001px;
  font-weight: bold;
`;

export const ComingSoonButton = styled(Button).attrs({
  color: "white",
  fontWeight: "bold",
})`
  padding: 10%;
  width: 100%;
  align-self: center;
  zindex: 1001px;
  font-weight: bold;
`;

export const TipButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
