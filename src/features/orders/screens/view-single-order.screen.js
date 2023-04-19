/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useMemo } from "react";

import { SafeArea } from "../../../components/utils/safe-area.component";
import { Button, Divider, List } from "react-native-paper";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../infrastructure/theme/colors";
import {
  Alert,
  KeyboardAvoidingView,
  View,
  Platform,
  Dimensions,
} from "react-native";
import {
  ModifyItemTitle,
  OrderTitleContainer,
  AuthButton,
  CreateButton,
} from "../../account/components/account.styles";
import { UpdateOrderStatus } from "../components/change-status.component";
import TimePicker from "react-native-wheel-time-picker";
import {
  MenuCategoryCard,
  PickupCard,
} from "../../restaurants/components/restaurant-info-card.styles";
import { UpdatePickupTime } from "../components/update-pickup-time.service";

const { width, height } = Dimensions.get("window");

function allAreNull(arr) {
  if (!arr.length) {
    return false;
  }
  return true;
}

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export const ViewSingleOrder = (props) => {
  const [newStatus, setNewStatus] = useState("Confirm Order");
  const [pushStatus, setPushStatus] = useState("preparing");
  const [pickupTime, setPickupTime] = useState(false);
  const [refundValue, setRefundValue] = useState(0);
  const [localPickupTime, setLocalPickupTime] = useState(
    props.route.params.props.value.pickupTime
  );
  const [chooseHoursToggle, setChooseHoursToggle] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [statusColor, setStatusColor] = useState("white");
  const [buttonStatus, setButtonStatus] = useState(false);
  const [startTimeValue, setStartTimeValue] = useState(
    Date.now() % MILLISECONDS_PER_DAY
  );

  const adjustTime = (hour, min) => {
    var hoursFixed = hour > 12 ? hour % 12 : hour;
    var AmOrPm = hour >= 12 ? "pm" : "am";
    if (min < 10) {
      var adjustedMinutes = `0${min}`;
      var finalTime = hoursFixed + ":" + adjustedMinutes + " " + AmOrPm;

      setLocalPickupTime(finalTime);
    } else {
      var finalTime = hoursFixed + ":" + min + " " + AmOrPm;
      setLocalPickupTime(finalTime);
    }
  };

  useEffect(() => {
    if (props.route.params.props.value.refundData.length !== 0) {
      let tempValue = 0;
      for (let object of props.route.params.props.value.refundData) {
        tempValue = object.refundAmount + tempValue;
      }
      tempValue = parseFloat(tempValue) / 100;
      setRefundValue(tempValue);
      // console.log(tempValue);
    }
  }, []);

  useEffect(() => {
    if (
      props.route.params.props.value.pickupTime === "" &&
      localPickupTime === ""
    ) {
      setStatusColor("#BE1E2D99");
    } else {
      setStatusColor("white");
    }
  }, [props.route.params.props.value.pickupTime, localPickupTime]);

  useEffect(() => {
    if (startTimeValue) {
      var todayDate = new Date();
      todayDate.setMinutes(
        todayDate.getMinutes() - todayDate.getTimezoneOffset() + 30
      );
    }
    setStartTimeValue(todayDate % MILLISECONDS_PER_DAY);
  }, []);

  var todayDate = new Date();
  todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());

  const [localStatus, setLocalStatus] = useState(
    props.route.params.props.value.status
  );

  useEffect(() => {
    if (localStatus === "completed") {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  }, [localStatus]);

  var b = new Date();
  b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
  let useDate = b.toISOString().slice(0, 10);

  // console.log(props.route.params.props.value.status);

  const [startHour, startMin] = useMemo(() => {
    return [
      Math.floor(startTimeValue / MILLISECONDS_PER_HOUR),
      Math.floor(
        (startTimeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
      ),
      Math.floor((startTimeValue % MILLISECONDS_PER_MINUTE) / 1000),
    ];
  }, [startTimeValue]);

  useEffect(() => {
    if (localStatus === "new") {
      setNewStatus("Confirm Order");
      setPushStatus("preparing");
    }
    if (localStatus === "preparing" || localStatus === "confirmed") {
      setNewStatus("ready");
      setPushStatus("ready");
    }
    if (localStatus === "ready") {
      setNewStatus("completed");
      setPushStatus("completed");
    }
    if (localStatus === "completed") {
      setNewStatus("completed");
      setPushStatus("completed");
    }
  }, [props.route.params.props.value.status, localStatus]);

  const updateLocalStatus = () => {
    if (localStatus === "new") {
      setLocalStatus("preparing");
    }
    if (localStatus === "preparing") {
      setLocalStatus("ready");
    }
    if (localStatus === "ready") {
      setLocalStatus("completed");
    }
  };

  const AlertStatusChange = (item) => {
    // console.log(restaurant);
    Alert.alert("Action", `Update this order to: ${pushStatus}?`, [
      {
        text: "No",
        onPress: () => {
          setButtonStatus(false);
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          try {
            UpdateOrderStatus(
              pushStatus,
              true,
              props.route.params.props.value.number,
              useDate
            ),
              updateLocalStatus();
            setButtonStatus(false);
            return;
          } catch (e) {
            setButtonStatus(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView>
        <OrderTitleContainer>
          <Spacer size="small" />
          <ModifyItemTitle labelStyle={{ fontSize: 16 }} type="text">
            Order: {props.route.params.props.value.number}
          </ModifyItemTitle>
          <Spacer size="small" />
        </OrderTitleContainer>

        <Spacer size="large" />
        <Spacer size="large" position="left">
          <Spacer size="large" position="right">
            <>
              {props.route.params.props.value.status !== "completed" && (
                <>
                  <PickupCard style={{ backgroundColor: statusColor }}>
                    <TouchableOpacity
                      onPress={() => {
                        setChooseHoursToggle(!chooseHoursToggle);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {!toggleStatus && (
                          <>
                            {localPickupTime !== "" && (
                              <>
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  Current Pickup Time: {localPickupTime}
                                  {/* {`${
                                    startHour > 12 ? startHour : startHour % 12
                                  }:${
                                    startMin < 10 ? "0" + startMin : startMin
                                  }`}{" "}
                                  {`${startHour < 12 ? "AM" : "PM"}`} */}
                                </Text>
                              </>
                            )}
                            {localPickupTime === "" && (
                              <>
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  Please select pickup time
                                </Text>
                              </>
                            )}
                          </>
                        )}

                        {chooseHoursToggle && (
                          <Text
                            style={{
                              paddingRight: 20,
                              paddingTop: 5,
                              paddingBottom: 5,
                              fontSize: 25,
                            }}
                          >
                            -
                          </Text>
                        )}
                        {!chooseHoursToggle && (
                          <Text
                            style={{
                              paddingRight: 20,

                              fontSize: 25,
                            }}
                          >
                            +
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    {chooseHoursToggle && (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingRight: "15%",
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingLeft: "15%",
                            }}
                          >
                            <Text
                              style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              New Pickup Time:
                            </Text>
                            <Text
                              style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {`${
                                startHour === 0
                                  ? "12"
                                  : startHour <= 12
                                  ? startHour
                                  : startHour % 12
                              }:${startMin < 10 ? "0" : ""}${startMin} ${
                                startHour < 12 ? "AM" : "PM"
                              }`}
                            </Text>
                          </View>
                          <TimePicker
                            textStyle={{ fontSize: 19 }}
                            containerStyle={{ height: 125 }}
                            value={startTimeValue}
                            wheelProps={{
                              wheelHeight: 115,
                              itemHeight: 19,
                              height: 150,
                            }}
                            onChange={(newValue) => {
                              {
                                setStartTimeValue(newValue),
                                  setPickupTime(true);
                              }
                            }}
                          />
                        </View>
                        <Spacer size="large" />
                        <Spacer size="larsge" />
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 20,
                            paddingBottom: 15,
                          }}
                        >
                          <CreateButton
                            mode="contained"
                            onPress={() => {
                              localStatus === "new"
                                ? Alert.alert("Please confrim order first")
                                : (setChooseHoursToggle(!chooseHoursToggle),
                                  UpdatePickupTime(
                                    startHour,
                                    startMin,
                                    true,
                                    props.route.params.props.value.number,
                                    useDate
                                  ),
                                  adjustTime(startHour, startMin));
                            }}
                          >
                            Set time
                          </CreateButton>
                        </View>
                      </>
                    )}
                  </PickupCard>
                </>
              )}
              <Spacer size="large" />
            </>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 20 }}>
                  Customer: {props.route.params.props.value.customer}
                </Text>
                <Text style={{ fontSize: 20 }}>Status: {localStatus}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 20 }}>
                  Total:{" "}
                  {(props.route.params.props.value.total / 100).toFixed(2)}
                </Text>
                <Text style={{ fontSize: 20 }}>
                  Tip: {props.route.params.props.value.tip}
                </Text>
              </View>
            </View>
          </Spacer>
        </Spacer>
        {props.route.params.props.value.refundData.length !== 0 ? (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 15,
              }}
            >
              <Text variant="error" style={{ fontSize: 20 }}>
                Refunded:{" "}
                {parseFloat(refundValue).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
            </View>
          </>
        ) : null}
        <ScrollView style={{ maxHeight: height * 0.45 }}>
          <List.Section>
            {props.route.params.props.value.cart.map((item, i) => {
              return (
                <>
                  <TouchableOpacity onPress={() => null}>
                    <List.Item
                      key={`item-${i}`}
                      title={`${item.item}  $${item.price / 100}`}
                      right={() => (
                        <Text style={{ paddingRight: 15, fontSize: 16 }}>
                          -
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
                            {
                              /* console.log(option); */
                            }
                            if (!option) {
                              const key = option;
                              return;
                            } else {
                              const key = option;
                              return (
                                <Spacer position="left" size="small">
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: colors.brand.primary,
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
      </KeyboardAvoidingView>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: 30,
          marginRight: 30,
          marginLeft: 30,
        }}
      >
        {!chooseHoursToggle && (
          <AuthButton
            disabled={buttonStatus}
            onPress={() => {
              newStatus === "ready" &&
              (localPickupTime === "" || localPickupTime === false)
                ? Alert.alert("Please enter pickup time")
                : // console.log(pickupTime),
                  // console.log(newStatus),
                  (setButtonStatus(true), AlertStatusChange());
              // UpdateOrderStatus(
              //   pushStatus,
              //   true,
              //   props.route.params.props.value.number,
              //   useDate
              // ),
              //   updateLocalStatus();
            }}
            mode="contained"
          >
            {newStatus}
          </AuthButton>
        )}
      </View>
    </SafeArea>
  );
};
