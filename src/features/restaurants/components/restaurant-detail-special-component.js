/* eslint-disable prettier/prettier */
import React, { useState, useContext, useRef, useMemo, useEffect } from "react";
import { List, Divider } from "react-native-paper";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../infrastructure/theme/colors";
import { Text } from "../../../components/typography/text.component";

export const RestaurantDetailSpecialComponent = (props) => {
  const manipulatedProps = props;
  const {
    navigation,
    catName,
    rest,
    currentlyOpen,
    properties,
    ...exceptBoth
  } = manipulatedProps;

  const [catExpanded, setCatExpanded] = useState(false);

  let position = properties.findIndex((e) => e.name === catName);
  let show = false;
  position !== -1 ? (show = properties[position].isShowing) : (show = false);

  if (show === false || !show) {
    return <></>;
  }

  if (catName === "properties" || !catName) {
    return <></>;
  }

  return (
    <>
      <List.Accordion
        theme={{
          colors: { primary: colors.brand.primary },
        }}
        title={<Text>{catName}</Text>}
        left={(props) => <List.Icon {...props} icon="food" />}
        expanded={catExpanded}
        onPress={() => setCatExpanded(!catExpanded)}
      >
        {Object.keys(exceptBoth).map((r, index) => (
          <>
            <TouchableOpacity
              key={index}
              disabled={
                exceptBoth[r].isAvailable && rest.isOpen && currentlyOpen
                  ? false
                  : true
              }
              onPress={() =>
                navigation.navigate("RestaurantItemScreen", {
                  item: exceptBoth[r],
                  rest: rest.name,
                  restaurant: rest,
                  navigation: navigation,
                })
              }
            >
              {exceptBoth[r].isShowing && (
                <>
                  <List.Item
                    title={<Text>{exceptBoth[r].name}</Text>}
                    right={(props) => (
                      <Text
                        variant="label"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          paddingRight: 5,
                          paddingTop: 5,
                          fontWeight: 300,
                        }}
                      >
                        {exceptBoth[r].isAvailable ? (
                          <Text>
                            {parseFloat(exceptBoth[r].price).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: "USD",
                              }
                            )}
                          </Text>
                        ) : (
                          <Text>OUT</Text>
                        )}
                      </Text>
                    )}
                  />
                </>
              )}
            </TouchableOpacity>
            <Divider />
          </>
        ))}
      </List.Accordion>
    </>
  );
};
