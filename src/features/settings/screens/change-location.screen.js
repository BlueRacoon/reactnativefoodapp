/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import {
  AccountBackground,
  AccountContainer,
  AccountCover,
  AuthButton,
  AuthInput,
  ErrorContainer,
  LocationAccountContainer,
  SmallAccountContainer,
  Title,
} from "../../account/components/account.styles";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ToggleUpdatingIndicator,
  UpdateAddressIndicator,
  UpdatingIndicator,
} from "../../cart/components/cart.styles";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../App";
import { RestaurantBackendContext } from "../../../services/restaurant-backend/restaurant-backend.context";
import Geocoder from "react-native-geocoding";

//GOOGLE_API_KEY USED HERE
///////////REMOVED
Geocoder.init("REMOVED"); // use a valid API key

export const ChangeAddressScreen = ({ navigation }) => {
  const { localData } = useContext(RestaurantBackendContext);
  const [localError, setLocalError] = useState(false);
  const [address, setAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentViewport, setCurrentViewport] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loadAddressToggle, setLoadAddressToggle] = useState(false);
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Please wait while we fetch your location..."
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let newLocation = await Location.getCurrentPositionAsync({});
      setLocation(newLocation);
    })();
  }, []);

  useEffect(() => {
    if (!loadAddressToggle) {
      CheckIfLocationEnabled();
      GetCurrentLocation();
    }
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    setIsLoading(true);
    setDisplayCurrentAddress("Please wait while we fetch your location...");
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      setIsLoading(false);
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;
        setCurrentLatitude(latitude.toFixed(6));
        setCurrentLongitude(longitude.toFixed(6));
        let tempLocation = {
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        };
        let tempViewport = {
          northeast: {
            lat: parseFloat(`${(parseFloat(latitude) - 0.005).toFixed(6)}`),
            lng: parseFloat(`${(parseFloat(longitude) + 0.0156).toFixed(6)}`),
          },
          southwest: {
            lat: parseFloat(`${(parseFloat(latitude) - 0.008).toFixed(6)}`),
            lng: parseFloat(`${(parseFloat(longitude) + 0.012).toFixed(6)}`),
          },
        };
        setCurrentViewport(tempViewport);
        setCurrentLocation(tempLocation);
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          setCurrentCity(item.city);
          let address = `${item.name}, ${item.city}, ${item.postalCode}`;
          // console.log(address);
          setIsLoading(false);
          setCurrentAddress(item.name);
          setDisplayCurrentAddress(address);
        }
      }
    } catch {
      setIsLoading(false);
      setDisplayCurrentAddress("Error loading location");
    }
  };

  const getCurrentManualLocation = async () => {
    try {
      Geocoder.from(currentAddress + currentCity)
        .then((json) => {
          var location = json.results[0].geometry.location;
          setCurrentLatitude(location.lat.toFixed(6));
          setCurrentLongitude(location.lng.toFixed(6));
          let tempLocation = {
            lat: location.lat.toFixed(6),
            lng: location.lng.toFixed(6),
          };
          let tempViewport = {
            northeast: {
              lat: parseFloat(
                `${(parseFloat(location.lat) - 0.005).toFixed(6)}`
              ),
              lng: parseFloat(
                `${(parseFloat(location.lng) + 0.0156).toFixed(6)}`
              ),
            },
            southwest: {
              lat: parseFloat(
                `${(parseFloat(location.lat) - 0.008).toFixed(6)}`
              ),
              lng: parseFloat(
                `${(parseFloat(location.lng) + 0.012).toFixed(6)}`
              ),
            },
          };
          setCurrentViewport(tempViewport);
          setCurrentLocation(tempLocation);
          // console.log(location);
        })
        .catch((error) => {
          setCurrentLatitude(null);
          setCurrentLongitude(null);
          setCurrentViewport(null);
          setCurrentLocation(null);
          Alert.alert("Can not find this address");
        });
    } catch {
      Alert.alert("Issue with Geocode - reach out to AM team");
    }
  };

  const updateAddressFunction = async () => {
    setIsLoading(true);
    if (
      !currentViewport ||
      !currentLatitude ||
      !currentLongitude ||
      !currentCity ||
      !currentAddress
    ) {
      setIsLoading(false);
      return Alert.alert(
        "Issue with address, please Reload or enter manually."
      );
    }

    const docRef = doc(db, "restaurants", localData.name);
    // console.log(currentCity);
    try {
      setDoc(
        docRef,
        {
          city: currentCity,
          lat: currentLatitude,
          lng: currentLongitude,
          address: currentAddress,
          location: currentLocation,
          viewport: currentViewport,
        },
        { merge: true }
      );
      setIsLoading(false);
      Alert.alert("Address updated");
    } catch (e) {
      setIsLoading(false);
      Alert.alert("Please try again.");
    }
  };

  const updateAlert = () => {
    // console.log(restaurant);
    Alert.alert(
      "Action",
      `Update address to: 
      Address: ${currentAddress}
      City: ${currentCity}`,
      [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        {
          text: "Yes",
          onPress: () => {
            updateAddressFunction();
            return;
          },
        },
      ]
    );
  };

  return (
    <AccountBackground>
      {!loadAddressToggle && (
        <>
          <View
            style={{
              position: "absolute",
              top: "10%",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={200}
              color="#BF1F2E"
            />
            <TouchableOpacity
              style={{
                borderColor: "#BF1F2E",
                border: 1,
                borderWidth: 1,
                borderRadius: 50,
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}
              onPress={() => {
                setDisplayCurrentAddress(
                  "Please wait while we fetch your location..."
                ),
                  GetCurrentLocation();
              }}
            >
              <Text style={{ color: "#BF1F2E", fontSize: 25 }}>
                Get current location
              </Text>
            </TouchableOpacity>
            <Spacer size="large" />
            <LocationAccountContainer>
              {displayCurrentAddress !==
                "Please wait while we fetch your location..." && (
                <>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 20 }}>Location found!</Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Spacer size="large" />
                    <Text style={{ fontSize: 18 }}>
                      Address: {displayCurrentAddress}
                    </Text>
                    <Spacer size="small" />
                    <Text style={{ fontSize: 18 }}>
                      Latitude: {currentLatitude}
                    </Text>
                    <Spacer size="small" />
                    <Text style={{ fontSize: 18 }}>
                      Longitude: {currentLongitude}
                    </Text>
                  </View>
                </>
              )}
              {displayCurrentAddress ===
                "Please wait while we fetch your location..." && (
                <>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {displayCurrentAddress}
                    </Text>
                  </View>
                </>
              )}
            </LocationAccountContainer>
            <Spacer size="large" />
            {isLoading && (
              <>
                <UpdateAddressIndicator />
              </>
            )}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: "5%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AuthButton
              style={{ width: "45%" }}
              mode="contained"
              onPress={() => updateAlert()}
            >
              Update
            </AuthButton>
            <Spacer />
            <AuthButton
              style={{ width: "45%" }}
              mode="contained"
              onPress={() => setLoadAddressToggle(!loadAddressToggle)}
            >
              Manual
            </AuthButton>
          </View>
        </>
      )}
      {loadAddressToggle && (
        <>
          <View
            style={{
              position: "absolute",
              top: "18%",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Title>Enter New Address</Title>
            <LocationAccountContainer
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <AuthInput
                label="Enter Street"
                value={currentAddress}
                textContentType="text"
                autoCapitalize="none"
                onChangeText={(u) => setCurrentAddress(u)}
              />
              <Spacer size="large" />
              <AuthInput
                label="Enter City"
                value={currentCity}
                textContentType="text"
                autoCapitalize="none"
                onChangeText={(u) => setCurrentCity(u)}
              />

              <Spacer size="large" />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <AuthButton
                  style={{ width: "45%" }}
                  mode="contained"
                  onPress={() => {
                    if (!currentAddress || !currentCity) {
                      return Alert.alert("Enter address and city");
                    } else {
                      getCurrentManualLocation();
                    }
                  }}
                >
                  Search
                </AuthButton>
              </View>
            </LocationAccountContainer>
            {currentLatitude && (
              <SmallAccountContainer>
                <>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>Location found!</Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Spacer size="large" />
                    <Text style={{ fontSize: 18 }}>
                      Address: {currentAddress}
                    </Text>
                    <Spacer size="small" />
                    <Text style={{ fontSize: 18 }}>
                      Latitude: {currentLatitude}
                    </Text>
                    <Spacer size="small" />
                    <Text style={{ fontSize: 18 }}>
                      Longitude: {currentLongitude}
                    </Text>
                  </View>
                </>
              </SmallAccountContainer>
            )}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: "5%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <AuthButton
              style={{ width: "45%" }}
              mode="contained"
              onPress={() => updateAlert()}
            >
              Update
            </AuthButton>
            <Spacer />
            <AuthButton
              style={{ width: "45%" }}
              mode="contained"
              onPress={() => setLoadAddressToggle(!loadAddressToggle)}
            >
              Auto
            </AuthButton>
          </View>
        </>
      )}
    </AccountBackground>
  );
};
