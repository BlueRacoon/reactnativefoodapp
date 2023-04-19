/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import styled from "styled-components/native";

import { Search } from "../components/search.component";

import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { LocationContext } from "../../../services/location/location.context";
import { MapCallout } from "../components/map-callout.component";
import { CitiesContext } from "../../../services/cities/cities.context";
import { ChooseCities } from "../../restaurants/components/cities.component";

const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`;

export const CityContainer = styled.View`
  padding: ${(props) => props.theme.space[3]};
  position: absolute;
  z-index: 999;
  top: 47px;
  width: 100%;
`;

export const MapScreen = ({ navigation }) => {
  const { restList } = useContext(RestaurantsContext);
  const { location } = useContext(LocationContext);
  const { citiesList } = useContext(CitiesContext);
  const [latDelta, setLatDelta] = useState(0.004);
  const [lngDelta, setLngDelta] = useState(0.02);

  // console.log(restList);

  let lat, lng, viewport;

  location === null
    ? ((lat = 33.7748),
      (lng = -84.2963),
      (viewport = {
        northeast: { lat: 34.3079, lng: -83.6335 },
        southeast: { lat: 33.3048, lng: -83.6832 },
        southwest: { lat: 33.2868, lng: -84.7677 },
        northwest: { lat: 34.4362, lng: -84.6999 },
      }))
    : ({ lat, lng, viewport } = location);

  useEffect(() => {
    let northeastLat;
    let southwestLat;
    if (location === null) {
      setLatDelta(1.2);
      setLngDelta(0.7);
    } else {
      northeastLat = viewport.northeast.lat;
      southwestLat = viewport.southwest.lat;
      setLatDelta(northeastLat - southwestLat);
      setLngDelta(0.08);
    }
  }, [location, viewport]);

  return (
    <>
      {/* <SafeAreaView> */}
      {/* <Search /> */}
      <CityContainer style={{ justifyContent: "center", alignItems: "center" }}>
        {citiesList && <ChooseCities cityData={citiesList} />}
      </CityContainer>
      <Map
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
      >
        {restList.map((restaurant, i) => {
          console.log(restaurant.name);
          if (restaurant.isShowing === true) {
            return (
              <MapView.Marker
                key={restaurant.name}
                title={restaurant.name}
                coordinate={{
                  latitude: restaurant.lat,
                  longitude: restaurant.lng,
                }}
              >
                <MapView.Callout
                  onPress={() =>
                    navigation.navigate("RestaurantDetail", {
                      restaurant: restaurant,
                    })
                  }
                >
                  <MapCallout restaurant={restaurant} />
                </MapView.Callout>
              </MapView.Marker>
            );
          }
          {
            /* return (
            //BUG/ISSUE - map marker will not hide callout onPress. Can't seem to get this to work for some reason. Needs to be fixed later on
            <MapView.Marker
              key={restaurant.name}
              title={restaurant.name}
              coordinate={{
                latitude: restaurant.lat,
                longitude: restaurant.lng,
              }}
            >
              <MapView.Callout
                onPress={() =>
                  navigation.navigate("RestaurantDetail", {
                    restaurant: restaurant,
                  })
                }
              >
                <MapCallout restaurant={restaurant} />
              </MapView.Callout>
            </MapView.Marker>
          ); */
          }
        })}
      </Map>
    </>
  );
};
