/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import styled from "styled-components/native";
import { View, Text } from "react-native";
import { MapCallout } from "../components/map-callout.component";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import {
  Loading,
  LoadingContainer,
  MapBottomContainer,
  MapBottomTextContainer,
  MapTopContainer,
  MapTopLeftContainer,
  MapTopTextContainer,
} from "../../account/components/account.styles";
import { Feather } from "@expo/vector-icons";
import { OrdersContext } from "../../../services/orders/orders.context";

//process.env.REACT_APP_GOOGLE_KEY

const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`;

// const { width, height } = Dimensions.get("window");

export const OrderMapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { liveOrder } = useContext(OrdersContext);

  const [latDelta, setLatDelta] = useState(0.0038);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [expandedViewArray, setExpandedViewArray] = useState([]);
  const [expandedView, setExpandedView] = useState({
    latitude: 33.7748,
    longitude: -84.2963,
    latitudeDelta: 1.2,
    longitudeDelta: 0.5,
  });
  const [isLoading, setIsLoading] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [newRegion, setNewRegion] = useState(null);
  const [followUser, setFollowUser] = useState(false);
  const [navigationColor, setNavigationColor] = useState("white");

  ///////////REMOVED
  const GOOGLE_MAPS_APIKEY = "REMOVED";

  //   console.log(GOOGLE_MAPS_APIKEY);

  useEffect(() => {
    if (followUser === true) {
      setNavigationColor("#BF1F2E");
    } else {
      setNavigationColor("black");
    }
  }, [followUser]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      let tempLocation = await Location.getCurrentPositionAsync({});
      setCurrentLocation(tempLocation);
      setOrigin({
        latitude: tempLocation.coords.latitude,
        longitude: tempLocation.coords.longitude,
      });

      setDestination({
        latitude: liveOrder.value.restLoc.lat,
        longitude: liveOrder.value.restLoc.lng,
      });

      setIsLoading(false);
    })();
  }, []);

  const toggleNewRegion = () => {
    if (expanded) {
      mapRef.current.fitToCoordinates(expandedViewArray, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
        animated: true,
      });
    } else {
      let tempRegion = {
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: 0.0095,
      };

      setNewRegion(tempRegion);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Map
        ref={mapRef}
        style={{ flex: 1 }}
        region={newRegion}
        animated={true}
        showsUserLocation={true}
        followsUserLocation={followUser}
        onRegionChange={null}
        initialRegion={expandedView}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={7}
          strokeColor="#BF1F2E"
          onReady={(result) => {
            let miles = parseFloat(result.distance) * 0.621371;
            setDistance(miles.toFixed(0));
            setDuration(result.duration.toFixed(0));
            setExpandedViewArray(result.coordinates);
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              },
              animated: true,
            });
          }}
        />
        <View style={{ height: "95%", width: "92%" }}>
          {isLoading && (
            <LoadingContainer>
              <Loading animating={true} color="#BF1F2E" size={75} />
            </LoadingContainer>
          )}
        </View>
        <MapView.Marker
          coordinate={destination}
          title={"destination"}
          description={`${liveOrder.value.restaurant}`}
        />
      </Map>
      <MapTopLeftContainer>
        <Feather
          style={{ paddingRight: 10 }}
          name="maximize"
          size={35}
          color="black"
          onPress={() => {
            setFollowUser(false);
            setExpanded(!expanded);
            toggleNewRegion();
          }}
        />
        <Feather
          name="navigation"
          size={35}
          color={navigationColor}
          onPress={() => {
            setFollowUser(!followUser);
          }}
        />
      </MapTopLeftContainer>
      <MapTopContainer>
        <MapTopTextContainer>
          <Text style={{ fontSize: 16, color: "black " }}>
            Destination: {liveOrder.value.restaurant}
          </Text>
        </MapTopTextContainer>
      </MapTopContainer>
      <MapBottomContainer>
        <View
          style={{
            justifyContent: "center",
            height: "92%",
          }}
        >
          <MapBottomTextContainer>
            <Text style={{ fontSize: 18, color: "black " }}>Duration:</Text>
            <Text style={{ fontSize: 18, color: "black " }}>
              {duration} mins
            </Text>
          </MapBottomTextContainer>
          <MapBottomTextContainer>
            <Text style={{ fontSize: 18, color: "black " }}>Distance:</Text>
            <Text style={{ fontSize: 18, color: "black " }}>
              {distance} miles
            </Text>
          </MapBottomTextContainer>
        </View>
      </MapBottomContainer>
    </View>
  );
};
