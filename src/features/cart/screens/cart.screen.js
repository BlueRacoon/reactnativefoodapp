/* eslint-disable prettier/prettier */
import React, { useContext, useState, useEffect } from "react";

import { SafeArea } from "../../../components/utils/safe-area.component";
import { Divider, List, ToggleButton } from "react-native-paper";
import { Text } from "../../../components/typography/text.component";
import { CartContext } from "../../../services/cart/cart.context";
import { CreditCardInput } from "../components/credit-card.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  CartIconContainer,
  CartIcon,
  NameInput,
  PayButton,
  ClearButton,
  CartPaymentProcessing,
} from "../components/cart.styles";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RestaurantInfoCardNoPhoto } from "../../restaurants/components/restaurant-info-card-nophoto.component";
import { payRequest } from "../../../services/checkout/checkout.service";
import { colors } from "../../../infrastructure/theme/colors";
import { Alert, KeyboardAvoidingView, View } from "react-native";

// import ButtonToggleGroup from "react-native-button-toggle-group";
import { MenuCategoryCard } from "../../restaurants/components/restaurant-info-card.styles";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import {
  updateCount,
  UpdateNewOrder,
} from "../../../services/checkout/order.service";
import {
  getDeliveryQuote,
  testDelivery,
} from "../../../services/checkout/delivery.service";

import Geocoder from "react-native-geocoding";

//GOOGLE_API_KEY USED HERE
Geocoder.init("AIzaSyDnDbUjfSShDRBYGR2uCCzM0-U5SCSPQws"); // use a valid API key

export const CartScreen = ({ navigation }) => {
  const { cart, restaurant, clearCart, sum, deleteItem, menuSelected } =
    useContext(CartContext);
  const { user } = useContext(AuthenticationContext);
  const { retrieveOneRestaurant } = useContext(RestaurantsContext);
  const [name, setName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTip, setSelectedTip] = useState("15%");
  const [finalTotal, setFinalTotal] = useState(0);
  const [stripeFinalTotal, setStripeFinalTotal] = useState(0);
  const [feeToggle, setFeeToggle] = useState(false);
  const [currentTax, setCurrentTax] = useState(1.06);
  const [appyFee, setAppyFee] = useState(1.02);
  const [totalFees, setTotalFees] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalAMFee, setTotalAMFee] = useState(0);
  const [calculatedTip, setCalculatedTip] = useState(0);
  const [pickupChoice, setPickupChoice] = useState("Pickup");
  const [currentTime, setCurrentTime] = useState(0);
  const [orderStatus, setOrderStatus] = useState("order");
  const [cartButtonText, setCartButtonText] = useState("make selctions");
  const [buttonIcon, setButtonIcon] = useState("");
  const [deliveryQuote, setDeliveryQuote] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [totalToggle, setTotalToggle] = useState(true);

  useEffect(() => {
    if (orderStatus === "order") {
      setButtonIcon("");
      setCartButtonText("make selections");
    } else if (orderStatus === "selections") {
      setButtonIcon("");
      setCartButtonText("add payment");
    } else if (orderStatus === "payment") {
      setButtonIcon("");
      setCartButtonText("review");
    } else if (orderStatus === "review") {
      setButtonIcon("cash");
      setCartButtonText("checkout");
    }
  }, [orderStatus]);

  useEffect(() => {
    if (selectedTip !== "none") {
      setCalculatedTip(
        parseFloat(((sum * (parseFloat(selectedTip) / 100)) / 100).toFixed(2))
      );
      setFinalTotal(
        parseFloat(
          (
            (sum * (1 + parseFloat(selectedTip) / 100)) / 100 +
            parseFloat(totalFees) +
            (pickupChoice === "Delivery" ? parseFloat(deliveryQuote / 100) : 0)
          ).toFixed(2)
        )
      );
    } else {
      setCalculatedTip(0);
      setFinalTotal(
        parseFloat(
          (
            sum / 100 +
            parseFloat(totalFees) +
            (pickupChoice === "Delivery" ? parseFloat(deliveryQuote / 100) : 0)
          ).toFixed(2)
        )
      );
    }
  }, [selectedTip, sum, currentTax, totalFees, pickupChoice, deliveryQuote]);

  function allAreNull(arr) {
    if (!arr.length) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    var todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    setCurrentTime(todayDate);
  }, [cart, isLoading]);

  useEffect(() => {
    setTotalTax(parseFloat(((sum / 100) * (currentTax - 1)).toFixed(2)));
    setTotalAMFee(parseFloat(((sum / 100) * (appyFee - 1)).toFixed(2)));
  }, [sum, appyFee, currentTax]);

  useEffect(() => {
    let newTotal = parseFloat(totalTax) + parseFloat(totalAMFee);
    setTotalFees(newTotal.toFixed(2));
  }, [totalTax, totalAMFee]);

  useEffect(() => {
    setStripeFinalTotal(parseFloat(parseFloat(finalTotal * 100).toFixed()));
  }, [finalTotal]);

  const onPay = () => {
    setIsLoading(true);

    retrieveOneRestaurant(restaurant.name).then((res) => {
      if (res.menuSelected !== menuSelected) {
        setIsLoading(false);
        navigation.navigate("CartError", {
          error: "Restaurant menu not available",
        });
        return;
      }

      if (res.isOpen === false) {
        setIsLoading(false);
        navigation.navigate("CartError", {
          error: "Restaurant is currently closed",
        });
        return;
      }

      let tempHour = parseFloat(currentTime.getUTCHours());
      let tempMin = parseFloat(currentTime.getMinutes());

      let tempTime;
      tempMin.toString().length === 1
        ? (tempTime = `${tempHour}0${tempMin}`)
        : (tempTime = `${tempHour}${tempMin}`);

      if (
        parseFloat(res.hours.substr(5, 4)) <= parseFloat(tempTime) ||
        parseFloat(tempTime) < parseFloat(res.hours.substr(0, 4))
      ) {
        // console.log(res.hours);

        setIsLoading(false);
        navigation.navigate("CartError", {
          error: "Restaurant is currently closed",
        });
        return;
      }

      if (pickupChoice === "Delivery") {
        if (!deliveryQuote || !state || !zip || deliveryAddress.length === 0) {
          setIsLoading(false);
          navigation.navigate("CartError", {
            error: "Please check delivery address",
          });
          return;
        } else if (phoneNumber.length !== 10) {
          // console.log()
          setIsLoading(false);
          navigation.navigate("CartError", {
            error: "Invalid phone number",
          });
          return;
        } else {
          null;
        }
      }

      if (!card || !card.id) {
        setIsLoading(false);
        navigation.navigate("CartError", {
          error: "Please fill in a valid credit card",
        });
        return;
      }
      if (stripeFinalTotal > 30000) {
        setIsLoading(false);
        navigation.navigate("CartError", {
          error: "Order over $300. Please call restaurant",
        });
        return;
      }
      let tempUserEmail = user.email;
      let tempRestEmail = restaurant.email.toLowerCase();
      payRequest(
        card.id,
        stripeFinalTotal,
        name,
        restaurant.name,
        cart,
        totalAMFee,
        calculatedTip,
        totalTax,
        pickupChoice,
        tempUserEmail,
        tempRestEmail,
        restaurant.location,
        restaurant.viewport,
        menuSelected
      )
        .then((result) => {
          // need to return the order ID from pay.

          UpdateNewOrder(result.paymentIntent, result.paymentIntent.id).then(
            (res) => {
              let ddRestAddress = `${restaurant.address} ${restaurant.city}, ${restaurant.state}, ${restaurant.zip}`;

              let doorDashInfo = {
                external_delivery_id: res,

                pickup_address: ddRestAddress,
                pickup_phone_number: restaurant.phoneNumber,
                dropoff_address: deliveryAddress,
                dropoff_phone_number: phoneNumber,
              };

              pickupChoice === "Delivery" && res !== false
                ? testDelivery(doorDashInfo).then((doordashResult) => {
                    if (res) {
                      updateCount();
                      clearCart();
                      setIsLoading(false);
                      navigation.navigate("CartSuccess");
                    } else {
                      updateCount();
                      setIsLoading(false);
                      clearCart();
                      navigation.navigate("CartSuccess");
                      console.log("Issue getting paymentIntent");
                    }
                  })
                : res !== false
                ? (updateCount(),
                  setIsLoading(false),
                  clearCart(),
                  navigation.navigate("CartSuccess"))
                : (updateCount(),
                  setIsLoading(false),
                  clearCart(),
                  navigation.navigate("CartSuccess"),
                  // console.log(res, ),
                  console.log(
                    "Issue getting paymentIntent, order ID, and doordashID"
                  ));
            }
          );
        })
        .catch((err) => {
          setIsLoading(false);
          navigation.navigate("CartError", {
            error: err,
          });
        });
    });
  };

  const deleteItemAlert = (item) => {
    // console.log(restaurant);
    Alert.alert("Action", "Do you want to delete this item?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          deleteItem(item.id);
          return;
        },
      },
    ]);
  };

  const getCurrentManualLocation = async () => {
    try {
      Geocoder.from(streetAddress + city)
        .then((json) => {
          setZip(json.results[0].address_components[6].short_name);
          setState(json.results[0].address_components[4].short_name);

          setDeliveryAddress(
            `${streetAddress} ${city}, ${json.results[0].address_components[6].short_name}, ${json.results[0].address_components[4].short_name}`
          );
        })
        .catch((error) => {});
    } catch {}
  };

  const clearLocalVaribles = () => {
    setName("");
    setStreetAddress("");
    setCity("");
    setZip("");
    setState("");
    setPhoneNumber("");
    setCard(null);
    setSelectedTip("15%");
    setPickupChoice("Pickup");
    setDeliveryQuote(0);
    setDeliveryAddress("");
    setOrderStatus("order");
  };

  const theme = {
    roundness: 5,
    version: 3,

    BackgroundColor: "white",
    colors: {
      primary: "white",
      onPrimary: "white",
      secondary: "white",
      tertiary: "white",
    },
  };

  return (
    <SafeArea>
      {!cart.length || !restaurant ? (
        <>
          <CartIconContainer>
            <CartIcon icon="cart-off" />
            <Text>Your cart is empty!</Text>
          </CartIconContainer>
        </>
      ) : (
        <>
          <Spacer size="large" />
          {isLoading && (
            <View
              style={{
                justifyContent: "center",
                zIndex: 999,
                alignItems: "center",
                top: "50%",
              }}
            >
              <CartPaymentProcessing />
            </View>
          )}
          <RestaurantInfoCardNoPhoto restaurant={restaurant} />
          <Spacer size="large" />
          <Spacer size="small" />

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ToggleButton.Row
              style={{
                marginRight: 15,
                marginLeft: 15,
                height: 35,
              }}
              onValueChange={(val) => setOrderStatus(val)}
              value={orderStatus}
            >
              <ToggleButton
                theme={theme}
                value="order"
                icon={() => (
                  <View>
                    <Text
                      style={{
                        color: orderStatus === "order" ? "white" : "black",
                      }}
                    >
                      order
                    </Text>
                  </View>
                )}
                style={{
                  width: "25%",
                  backgroundColor:
                    orderStatus === "order" ? colors.brand.primary : "white",
                  color: orderStatus === "order" ? "black" : "white",
                  borderColor: "white",
                  // BackgroundColor: colors.brand.primary,
                  // highlightTextColor: "white",
                  // inactiveTextColor: colors.brand.primary,
                }}
              />
              <ToggleButton
                theme={theme}
                icon={() => (
                  <View>
                    <Text
                      style={{
                        color: orderStatus === "selections" ? "white" : "black",
                      }}
                    >
                      selections
                    </Text>
                  </View>
                )}
                style={{
                  width: "25%",

                  backgroundColor:
                    orderStatus === "selections"
                      ? colors.brand.primary
                      : "white",
                  borderColor: "white",
                  // backgroundColor: "black",
                  // highlightBackgroundColor: colors.brand.primary,
                  // highlightTextColor: "white",
                  // inactiveTextColor: colors.brand.primary,
                }}
                value="selections"
              />
              <ToggleButton
                value="payment"
                theme={theme}
                style={{
                  width: "25%",
                  backgroundColor:
                    orderStatus === "payment" ? colors.brand.primary : "white",
                  borderColor: "white",
                  highlightBackgroundColor: colors.brand.primary,
                  highlightTextColor: "white",
                  inactiveTextColor: colors.brand.primary,
                }}
                icon={() => (
                  <View>
                    <Text
                      style={{
                        color: orderStatus === "payment" ? "white" : "black",
                      }}
                    >
                      payment
                    </Text>
                  </View>
                )}
              />
              <ToggleButton
                value="review"
                theme={theme}
                style={{
                  width: "25%",
                  backgroundColor:
                    orderStatus === "review" ? colors.brand.primary : "white",
                  borderColor: "white",
                  highlightBackgroundColor: colors.brand.primary,
                  highlightTextColor: "white",
                  inactiveTextColor: colors.brand.primary,
                }}
                icon={() => (
                  <View>
                    <Text
                      style={{
                        color: orderStatus === "review" ? "white" : "black",
                      }}
                    >
                      review
                    </Text>
                  </View>
                )}
              />
            </ToggleButton.Row>
          </View>

          {/* <ButtonToggleGroup
            style={{
              marginRight: 15,
              marginLeft: 15,
              height: 35,
            }}
            highlightBackgroundColor={colors.brand.primary}
            highlightTextColor={"white"}
            inactiveBackgroundColor={"white"}
            inactiveTextColor={colors.brand.primary}
            values={["order", "selections", "payment", "review"]}
            value={orderStatus}
            onSelect={(val) => setOrderStatus(val)}
          /> */}
          <Spacer size="large" />
          <Spacer size="small" />
          <Divider />
          <Spacer size="large" />

          {orderStatus === "order" && (
            <>
              <Spacer position="left" size="medium">
                <Text>Your Order:</Text>
              </Spacer>
              <Spacer size="small" />
              <Spacer size="small" />
              <View style={{ maxHeight: "38%" }}>
                <ScrollView>
                  <List.Section>
                    {cart.map((item, i) => {
                      {
                        /* console.log("CART ITEM", item); */
                      }
                      return (
                        <>
                          <TouchableOpacity
                            onPress={() => deleteItemAlert(item)}
                          >
                            <List.Item
                              key={`item-${i}`}
                              title={`${item.item}  ${parseFloat(
                                item.price / 100
                              ).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}`}
                              right={() => (
                                <Text
                                  style={{ paddingRight: 15, fontSize: 16 }}
                                >
                                  x
                                </Text>
                              )}
                            />

                            {allAreNull(item.modifiers) && (
                              <>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollInsdicator={false}
                                  style={{ height: 30, paddingLeft: 25 }}
                                >
                                  {item.modifiers.map((option) => {
                                    if (!option) {
                                      const key = option;
                                      return;
                                    } else {
                                      const key = option;
                                      return (
                                        <Spacer position="left" size="small">
                                          <TouchableOpacity
                                            style={{
                                              backgroundColor:
                                                colors.brand.primary,
                                              borderRadius: 10,
                                              padding: 4,

                                              justifyContent: "center",
                                            }}
                                          >
                                            <Text
                                              variant="caption"
                                              style={{
                                                fontSize: 15,
                                                justifyContent: "center",
                                                color: "white",
                                              }}
                                            >
                                              {option}
                                            </Text>
                                          </TouchableOpacity>
                                        </Spacer>
                                      );
                                    }
                                  })}
                                  <Spacer size="xl" position="right" />
                                </ScrollView>
                              </>
                            )}
                          </TouchableOpacity>
                        </>
                      );
                    })}
                  </List.Section>
                </ScrollView>
              </View>
              <Spacer position="left" size="medium">
                <Spacer size="small" />
                <Spacer size="small" />
                <Text>
                  Total:{" "}
                  {parseFloat(sum / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </Spacer>
              <Spacer size="small" />
              <Spacer size="large" position="top" />
              <Divider />
            </>
          )}

          {orderStatus === "selections" && (
            <>
              <KeyboardAwareScrollView>
                <ScrollView>
                  <Spacer position="left" size="medium">
                    <Text>Select Tip </Text>
                  </Spacer>
                  <Spacer size="large" />
                  <Spacer size="small" />
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ToggleButton.Row
                      style={{
                        marginRight: 15,
                        marginLeft: 15,
                        height: 35,
                      }}
                      onValueChange={(val) => setSelectedTip(val)}
                      value={orderStatus}
                    >
                      <ToggleButton
                        theme={theme}
                        value="none"
                        icon={() => (
                          <View>
                            <Text
                              style={{
                                color:
                                  selectedTip === "none" ? "white" : "black",
                              }}
                            >
                              none
                            </Text>
                          </View>
                        )}
                        style={{
                          width: "25%",
                          backgroundColor:
                            selectedTip === "none"
                              ? colors.brand.primary
                              : "white",
                          borderColor: "white",
                        }}
                      />
                      <ToggleButton
                        theme={theme}
                        icon={() => (
                          <View>
                            <Text
                              style={{
                                color:
                                  selectedTip === "10%" ? "white" : "black",
                              }}
                            >
                              10%
                            </Text>
                          </View>
                        )}
                        style={{
                          width: "25%",
                          backgroundColor:
                            selectedTip === "10%"
                              ? colors.brand.primary
                              : "white",
                          borderColor: "white",
                        }}
                        value="10%"
                      />
                      <ToggleButton
                        value="15%"
                        theme={theme}
                        style={{
                          width: "25%",
                          backgroundColor:
                            selectedTip === "15%"
                              ? colors.brand.primary
                              : "white",
                          borderColor: "white",
                          highlightBackgroundColor: colors.brand.primary,
                          highlightTextColor: "white",
                          inactiveTextColor: colors.brand.primary,
                        }}
                        icon={() => (
                          <View>
                            <Text
                              style={{
                                color:
                                  selectedTip === "15%" ? "white" : "black",
                              }}
                            >
                              15%
                            </Text>
                          </View>
                        )}
                      />
                      <ToggleButton
                        value="20%"
                        theme={theme}
                        style={{
                          width: "25%",
                          backgroundColor:
                            selectedTip === "20%"
                              ? colors.brand.primary
                              : "white",
                          borderColor: "white",
                          highlightBackgroundColor: colors.brand.primary,
                          highlightTextColor: "white",
                          inactiveTextColor: colors.brand.primary,
                        }}
                        icon={() => (
                          <View>
                            <Text
                              style={{
                                color:
                                  selectedTip === "20%" ? "white" : "black",
                              }}
                            >
                              20%
                            </Text>
                          </View>
                        )}
                      />
                    </ToggleButton.Row>
                  </View>

                  {/* <ButtonToggleGroup
                    style={{
                      marginRight: 15,
                      marginLeft: 15,
                      height: 35,
                    }}
                    highlightBackgroundColor={colors.brand.primary}
                    highlightTextColor={"white"}
                    inactiveBackgroundColor={"white"}
                    inactiveTextColor={colors.brand.primary}
                    values={["none", "10%", "15%", "20%"]}
                    value={selectedTip}
                    onSelect={(val) => setSelectedTip(val)}
                  /> */}
                  <Spacer size="large" />
                  <Spacer position="left" size="medium">
                    {selectedTip === "none" && (
                      <>
                        <Text>Tip: none</Text>
                      </>
                    )}
                    {selectedTip !== "none" && (
                      <>
                        <Text>
                          Tip:{" "}
                          {parseFloat(calculatedTip).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </Text>
                      </>
                    )}
                  </Spacer>
                  <Spacer size="small" />

                  <Spacer size="large" />
                  <Divider />
                  <Spacer size="large" position="top" />
                  <Spacer position="left" size="medium">
                    <Text>Select Method </Text>
                  </Spacer>
                  <Spacer size="large" />
                  <Spacer size="small" />

                  <ToggleButton.Row
                    style={{
                      marginRight: 15,
                      marginLeft: 15,
                      height: 35,
                    }}
                    onValueChange={(val) =>
                      // setPickupChoice(val)
                      Alert.alert("Only pickup available at this location")
                    }
                    value={orderStatus}
                  >
                    <ToggleButton
                      theme={theme}
                      value="Pickup"
                      icon={() => (
                        <View>
                          <Text
                            style={{
                              color:
                                pickupChoice === "Pickup" ? "white" : "black",
                            }}
                          >
                            Pickup
                          </Text>
                        </View>
                      )}
                      style={{
                        width: "50%",
                        backgroundColor:
                          pickupChoice === "Pickup"
                            ? colors.brand.primary
                            : "white",
                        borderColor: "white",
                      }}
                    />
                    <ToggleButton
                      theme={theme}
                      icon={() => (
                        <View>
                          <Text
                            style={{
                              color:
                                pickupChoice === "Delivery" ? "white" : "black",
                            }}
                          >
                            Delivery
                          </Text>
                        </View>
                      )}
                      style={{
                        width: "50%",
                        backgroundColor:
                          pickupChoice === "Delivery"
                            ? colors.brand.primary
                            : "white",
                        borderColor: "white",
                      }}
                      value="Delivery"
                    />
                  </ToggleButton.Row>

                  {/* <ButtonToggleGroup
                    style={{
                      marginRight: 15,
                      marginLeft: 15,
                      height: 35,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    highlightBackgroundColor={colors.brand.primary}
                    highlightTextColor={"white"}
                    inactiveBackgroundColor={"white"}
                    inactiveTextColor={colors.brand.primary}
                    values={["Pickup", "Delivery"]}
                    value={pickupChoice}
                    onSelect={(val) =>
                      // setPickupChoice(val)
                      Alert.alert("Only pickup available at this location")
                    }
                  /> */}

                  <Spacer size="large" />
                  {pickupChoice === "Pickup" && (
                    <>
                      <Spacer position="left" size="medium">
                        <Text variant="caption">
                          *ASAP pickup time provided by restaurant on order
                          confirmation
                        </Text>
                      </Spacer>
                      <Spacer size="small" />
                      <Spacer size="large" />
                    </>
                  )}

                  {pickupChoice === "Delivery" && (
                    <>
                      <Spacer size="large" />
                      <NameInput
                        label="Enter street address"
                        value={streetAddress}
                        onChangeText={(SA) => setStreetAddress(SA)}
                      />
                      <Spacer size="small" />
                      <NameInput
                        label="Enter city"
                        value={city}
                        onChangeText={(c) => setCity(c)}
                      />
                      {zip.length !== 0 && state.length !== 0 && (
                        <>
                          <Spacer size="small" />
                          <Spacer size="large" position="left">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Delivery address:</Text>
                              <View
                                style={{
                                  paddingRight: "5%",
                                }}
                              >
                                <Text>{deliveryAddress}</Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Delivery quote:</Text>
                              <View style={{ paddingRight: "5%" }}>
                                <Text>
                                  {parseFloat(
                                    deliveryQuote / 100
                                  ).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })}
                                </Text>
                              </View>
                            </View>
                          </Spacer>
                          <Spacer size="large" />
                        </>
                      )}
                      <Spacer size="large" />
                      <PayButton
                        mode="contained"
                        onPress={() => {
                          if (city.length === 0 || streetAddress.length === 0) {
                            Alert.alert("Please fill in street and city");
                          } else {
                            setIsLoading(true);
                            getCurrentManualLocation().then(() => {
                              let tempAddress = `${streetAddress} ${city}, ${state}, ${zip}`;
                              let restAddress = `${restaurant.address} ${restaurant.city}, ${restaurant.state}, ${restaurant.zip}`;
                              let randID = `testID: ${Math.random() * 10000}`;
                              try {
                                getDeliveryQuote(
                                  randID,
                                  tempAddress,
                                  restAddress
                                ).then((result) => {
                                  if (result.hasOwnProperty("data")) {
                                    setDeliveryQuote(result.data.data.fee);
                                    setIsLoading(false);
                                  } else {
                                    setDeliveryQuote(0);
                                    setIsLoading(false);
                                    Alert.alert("Invalid delivery address!");
                                  }
                                });
                              } catch (error) {
                                setDeliveryQuote(0);
                                setIsLoading(false);
                                Alert.alert(
                                  "Issue getting delivery quote. Please try again or try new address."
                                );
                              }
                            });
                          }
                        }}
                      >
                        Set address
                      </PayButton>
                    </>
                  )}
                  <Spacer size="large" />

                  {pickupChoice === "Delivery" && (
                    <>
                      <PayButton
                        mode="contained"
                        onPress={() => {
                          setOrderStatus("payment");
                        }}
                      >
                        Add payment
                      </PayButton>
                    </>
                  )}
                  <Spacer size="large" />
                </ScrollView>
                <Spacer size="large" />
              </KeyboardAwareScrollView>
            </>
          )}
          {orderStatus === "payment" && (
            <>
              {/* <Spacer size="large" position="top" /> */}
              <KeyboardAvoidingView>
                <ScrollView>
                  <Spacer position="left" size="medium">
                    <Text>Payment Information:</Text>
                  </Spacer>
                  <Spacer size="small" />
                  <Spacer size="small" />
                  <NameInput
                    label="Enter name (Ex: Zach)"
                    value={name}
                    onChangeText={(t) => setName(t)}
                  />
                  <Spacer size="small" />
                  <NameInput
                    label="Enter phone number (Ex: 7702224444)"
                    value={phoneNumber}
                    onChangeText={(pn) => setPhoneNumber(pn)}
                  />

                  <Spacer position="top" size="large">
                    <Spacer position="left" size="medium">
                      {name.length > 0 && phoneNumber.length === 10 && (
                        <Text>Card Entry:</Text>
                      )}
                    </Spacer>

                    {name.length > 0 && phoneNumber.length === 10 && (
                      <CreditCardInput
                        name={name}
                        onSuccess={setCard}
                        onError={() => {
                          navigation.navigate("CartError", {
                            error: "Something went wrong processing your card",
                          });
                        }}
                      />
                    )}
                  </Spacer>
                  <Spacer size="large" />
                </ScrollView>
              </KeyboardAvoidingView>
            </>
          )}
          {orderStatus === "review" && (
            <>
              <Spacer position="left" size="medium">
                <Text>Tax & AM fee </Text>
              </Spacer>
              <Spacer size="large" />
              <Spacer size="small" />
              <TouchableOpacity
                onPress={() => {
                  setFeeToggle(!feeToggle), setTotalToggle(!totalToggle);
                }}
              >
                <MenuCategoryCard>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        paddingLeft: 20,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      Total:{" "}
                      {parseFloat(totalFees).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Text>
                    {feeToggle && (
                      <Text
                        style={{
                          paddingRight: 20,
                          paddingTop: 0,
                          paddingBottom: 0,
                          fontSize: 25,
                        }}
                      >
                        -
                      </Text>
                    )}
                    {!feeToggle && (
                      <Text
                        style={{
                          paddingRight: 20,
                          paddingTop: 0,
                          paddingBottom: 0,
                          fontSize: 25,
                        }}
                      >
                        +
                      </Text>
                    )}
                  </View>
                  {feeToggle && (
                    <>
                      <Text
                        style={{
                          paddingLeft: 35,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                      >
                        Tax:{" "}
                        {parseFloat(totalTax).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Text>
                      <Text
                        style={{
                          paddingLeft: 35,
                          paddingTop: 0,
                          paddingBottom: 10,
                        }}
                      >
                        AM Fee:{" "}
                        {parseFloat(totalAMFee).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                        ~ Nonrefundable
                      </Text>
                    </>
                  )}
                </MenuCategoryCard>
              </TouchableOpacity>
              <Spacer size="large" position="top" />
              <Spacer size="small" />
              <Divider />

              <Spacer size="large" />
              <Spacer position="left" size="medium">
                <Text>Summary:</Text>
              </Spacer>
              <Spacer size="large" />

              <Spacer size="small" />

              <TouchableOpacity
                onPress={() => {
                  setFeeToggle(!feeToggle), setTotalToggle(!totalToggle);
                }}
              >
                <MenuCategoryCard>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        paddingLeft: 20,
                        paddingTop: 5,
                        paddingBottom: 5,
                      }}
                    >
                      Order Total:{" "}
                      {parseFloat(finalTotal).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Text>

                    {totalToggle && (
                      <Text
                        style={{
                          paddingRight: 20,
                          paddingTop: 0,
                          paddingBottom: 0,
                          fontSize: 25,
                        }}
                      >
                        -
                      </Text>
                    )}
                    {!totalToggle && (
                      <Text
                        style={{
                          paddingRight: 20,
                          paddingTop: 0,
                          paddingBottom: 0,
                          fontSize: 25,
                        }}
                      >
                        +
                      </Text>
                    )}
                  </View>
                  {totalToggle && (
                    <>
                      {cart && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Items in cart:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text>{cart.length}</Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {card && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Card used:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text>Ends In {card.card.last4}</Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {!card && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Card used:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text variant="error">No card entered</Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {selectedTip && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Tip selected:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text>
                                  {selectedTip} ={" "}
                                  {parseFloat(calculatedTip).toLocaleString(
                                    "en-US",
                                    {
                                      style: "currency",
                                      currency: "USD",
                                    }
                                  )}
                                </Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {pickupChoice && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Method:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text>{pickupChoice}</Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {pickupChoice === "Delivery" && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Delivery address:</Text>
                              <View
                                style={{
                                  paddingRight: "10%",
                                }}
                              >
                                <Text>{deliveryAddress}</Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      {pickupChoice === "Delivery" && deliveryQuote !== 0 && (
                        <>
                          <Spacer size="small" />
                          <Spacer position="left" size="xl">
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Delivery quote:</Text>
                              <View style={{ paddingRight: "10%" }}>
                                <Text>
                                  {parseFloat(
                                    deliveryQuote / 100
                                  ).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })}
                                </Text>
                              </View>
                            </View>
                          </Spacer>
                        </>
                      )}
                      <Spacer size="large" />
                    </>
                  )}
                </MenuCategoryCard>
              </TouchableOpacity>
            </>
          )}

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              marginBottom: 30,
              marginRight: 30,
              marginLeft: 30,
            }}
          >
            {pickupChoice === "Delivery" && orderStatus === "selections" ? (
              <></>
            ) : (
              <>
                <PayButton
                  disabled={isLoading}
                  icon={buttonIcon}
                  mode="contained"
                  onPress={() => {
                    if (cartButtonText === "make selections") {
                      setOrderStatus("selections");
                    }
                    if (cartButtonText === "add payment") {
                      setOrderStatus("payment");
                    }
                    if (cartButtonText === "review") {
                      setOrderStatus("review");
                      setButtonIcon("cash");
                    }
                    if (cartButtonText === "checkout") {
                      onPay();
                    }
                  }}
                >
                  {cartButtonText}
                </PayButton>
              </>
            )}

            {orderStatus === "order" && (
              <>
                <Spacer position="top" size="large" />
                <ClearButton
                  disabled={isLoading}
                  icon="cart-off"
                  mode="contained"
                  onPress={() => {
                    clearCart();
                    clearLocalVaribles();
                  }}
                >
                  Clear Cart
                </ClearButton>
              </>
            )}
          </View>
        </>
      )}
    </SafeArea>
  );
};
