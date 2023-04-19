/* eslint-disable prettier/prettier */
import React from "react";
import { SvgXml } from "react-native-svg";
import { default as star } from "../../../../assets/star";
import { default as open } from "../../../../assets/open";
import { Spacer } from "../../../components/spacer/spacer.component";
import { New } from "../../../components/new/new.component";
import { Text } from "../../../components/typography/text.component";
import {
  Icon,
  Rating,
  Info,
  OrderCardCover,
  OrderCard,
  SectionEnd,
  Section,
  Address,
} from "./order-info-card.styles";

export const OrderInfoCard = ({ order = {} }) => {
  const {
    name = "Some Order",
    icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png",

    photos = [
      "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
    ],
    address = "100 some random street",
    isOpenNow = true,
    rating = 4,
    isClosedTemporarily = true,
    placeId,
  } = order;

  const ratingArray = Array.from(new Array(Math.floor(rating)));

  return (
    <>
      <OrderCard elevation={3}>
        <New order={order} />
        <OrderCardCover key={name} source={{ uri: photos[0] }} />
        <Info>
          <Text variant="label">{name}</Text>
          <Section>
            <Rating>
              {ratingArray.map((value, index) => (
                <SvgXml
                  key={`star-${placeId}-${index}`}
                  xml={star}
                  height={20}
                  width={20}
                />
              ))}
            </Rating>
            <SectionEnd>
              {isClosedTemporarily && (
                <Text variant="error">CLOSED TEMPORARILY</Text>
              )}
              <Spacer position="left" size="large">
                {isOpenNow && <SvgXml xml={open} width={25} height={25} />}
              </Spacer>
              <Spacer position="left" size="large">
                <Icon source={{ uri: icon }} />
              </Spacer>
            </SectionEnd>
          </Section>
          <Address>{address}</Address>
        </Info>
      </OrderCard>
    </>
  );
};
