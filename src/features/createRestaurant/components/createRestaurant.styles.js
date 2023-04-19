/* eslint-disable prettier/prettier */
import styled from "styled-components/native";
import { Button } from "react-native-paper";

export const EnterButton = styled(Button)`
  position: absolute;
  bottom: 0px;
  right: 35%;
  color: white;
  background-color: teal;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
`;

export const CreateRestaurantWrapper = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: center;
  background-color: #fff;
`;
