/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Text } from "../../../components/typography/text.component";

import styled from "styled-components/native";
import { RestaurantCard } from "./restaurant-info-card.styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native";

import WebView from "react-native-webview";
import { Platform } from "react-native";
import { LocationContext } from "../../../services/location/location.context";
import { Spacer } from "../../../components/spacer/spacer.component";

const CitiesContainer = styled.View`
  padding: ${(props) => props.theme.space[3]};
  z-index: 999;
  width: 95%;
`;

const CityCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 95%;
  align-self: center;
`;

const CityWrapper = styled.View`
  padding: ${(props) => props.theme.space[2]};
  width: 100%;
  fled-direction: row;
`;

const CompactCityImage = styled.Image`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const CompactCityWebview = styled(WebView)`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const CityItem = styled.View`
  padding: 10px;
  max-width: 120px;
  align-items: center;
`;

const isAndroid = Platform.OS === "android";

export const ChooseCities = (props) => {
  const [cityToggle, setCityToggle] = useState(false);
  const Image = isAndroid ? CompactCityWebview : CompactCityImage;
  const { keyword, search } = useContext(LocationContext);
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [updateKeyword, setUpdatedKeyword] = useState(keyword);

  const { cityData } = props;

  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  return (
    <>
      {props && (
        <CityWrapper>
          <TouchableOpacity onPress={() => setCityToggle(!cityToggle)}>
            <CityCard elevation={3}>
              <CitiesContainer>
                <Text>Choose Available Cities</Text>
                {cityToggle && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollInsdicator={false}
                  >
                    {cityData.map((r, k) => (
                      <>
                        <Spacer key={k} position="left" size="medium">
                          <TouchableOpacity
                            onPress={async () => {
                              await search(r.cityName);
                              setCityToggle(false);
                            }}
                          >
                            <CityItem>
                              <Image
                                source={{
                                  uri: r.cityPhoto,
                                }}
                              />
                              <Text center variant="caption" numberOfLines={3}>
                                {r.cityName}
                              </Text>
                            </CityItem>
                          </TouchableOpacity>
                        </Spacer>
                      </>
                    ))}
                  </ScrollView>
                )}
              </CitiesContainer>
            </CityCard>
          </TouchableOpacity>
        </CityWrapper>
      )}
    </>
  );
};
