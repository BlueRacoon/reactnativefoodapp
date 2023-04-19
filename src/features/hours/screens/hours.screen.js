/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Divider, RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import {
  AccountBackground,
  AccountContainer,
  AdminContainer,
  CreateButton,
  DropDownContainer,
  HoursButton,
  HourScreenWrapper,
  ScheduleButton,
} from "../../account/components/account.styles";

import { colors } from "../../../infrastructure/theme/colors";

import TimePicker from "react-native-wheel-time-picker";
import { MenuCategoryCard } from "../../restaurants/components/restaurant-info-card.styles";
import { RestaurantBackendContext } from "../../../services/restaurant-backend/restaurant-backend.context";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../App";

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export const HoursScreen = () => {
  const { localData, day, menuList } = useContext(RestaurantBackendContext);
  const [menuListState, setMenuListState] = useState(menuList);

  // console.log(localData);
  // console.log(day);

  useEffect(() => {
    if (menuList === false || typeof menuList === "undefined") {
      setMenuListState([]);
    }
  }, [menuList]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [chooseScheduleToggle, setChooseScheduleToggle] = useState(false);
  const [chooseMenuToggle, setChooseMenuToggle] = useState(false);
  const [chooseHoursToggle, setChooseHoursToggle] = useState(false);
  const [newStartTime, setNewStartTime] = useState(false);
  const [newEndTime, setNewEndTime] = useState(false);
  const [startTimeValue, setStartTimeValue] = useState(
    Date.now() % MILLISECONDS_PER_DAY
  );
  const [endTimeValue, setEndTimeValue] = useState(
    Date.now() % MILLISECONDS_PER_DAY
  );

  // useEffect(() => {
  //   console.log(startTimeValue);
  //   console.log(startHour);
  //   console.log(startMin);
  // }, [startTimeValue]);

  const [menusArray, setMenusArray] = useState([]);
  const [currentlyLoading, setCurrentlyLoading] = useState(false);
  const [viewScreen, setViewScreen] = useState(true);
  const [timeChosen, setTimeChosen] = useState(false);
  const [scheduleScreen, setScheduleScreen] = useState(false);
  const [menuScreen, setMenuScreen] = useState(false);
  const [scrollToggle, setScrollToggle] = useState(false);
  const [dayStatus, setDayStatus] = useState(null);
  const [scrollState, setScrollState] = useState(true);
  const [allDay, setAllDay] = useState(false);
  const [partDay, setPartDay] = useState(false);
  const [openDays, setOpenDays] = useState(false);
  const [currentDay, setCurrentDay] = useState("Monday");
  const [useCurrentDay, setUseCurrentDay] = useState("mon");
  const [toggleStatus, setToggleStatus] = useState(null);
  const [schdeuleToggleStatus, setSchdeuleToggleStatus] = useState(null);
  const [getDays, setGetDays] = useState([
    {
      label: "Monday",
      value: "Monday",
    },
    {
      label: "Tuesday",
      value: "Tuesday",
    },
    {
      label: "Wednesday",
      value: "Wednesday",
    },
    {
      label: "Thursday",
      value: "Thursday",
    },
    {
      label: "Friday",
      value: "Friday",
    },
    {
      label: "Saturday",
      value: "Saturday",
    },
    {
      label: "Sunday",
      value: "Sunday",
    },
  ]);

  useEffect(() => {
    let abriviatedDay = abriviateDay(currentDay);
    setUseCurrentDay(abriviatedDay);
  }, [currentDay]);

  const abriviateDay = (sel) => {
    if (sel === "Monday") {
      return "mon";
    }
    if (sel === "Tuesday") {
      return "tues";
    }
    if (sel === "Wednesday") {
      return "wed";
    }
    if (sel === "Thursday") {
      return "thurs";
    }
    if (sel === "Friday") {
      return "fri";
    }
    if (sel === "Saturday") {
      return "sat";
    }
    if (sel === "Sunday") {
      return "sun";
    }
  };

  const [endHour, endMin] = useMemo(() => {
    return [
      Math.floor(endTimeValue / MILLISECONDS_PER_HOUR),
      Math.floor(
        (endTimeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
      ),
      Math.floor((endTimeValue % MILLISECONDS_PER_MINUTE) / 1000),
    ];
  }, [endTimeValue]);

  const [startHour, startMin] = useMemo(() => {
    return [
      Math.floor(startTimeValue / MILLISECONDS_PER_HOUR),
      Math.floor(
        (startTimeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE
      ),
      Math.floor((startTimeValue % MILLISECONDS_PER_MINUTE) / 1000),
    ];
  }, [startTimeValue]);

  const changeTimeAlert = (dayUsed, timeUsed) => {
    Alert.alert(
      "Action",
      `Do you change the hours of ${dayUsed} to ${timeUsed}?`,
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
            pushTime(dayUsed, timeUsed);
            // console.log(timeUsed);
            // console.log(dayUsed);
            return;
          },
        },
      ]
    );
  };

  const pushTime = async (day, time) => {
    setCurrentlyLoading(true);
    if (parseFloat(time.substring(5, 9)) <= parseFloat(time.substring(0, 4))) {
      setCurrentlyLoading(false);
      // console.log(time);
      return alert("Issue with Time Selection. Please correct time");
    }
    //
    // console.log(day);
    // console.log(time);
    // console.log(localData);

    if (time) {
      const docRef = doc(db, "restaurants", localData.name);
      try {
        setDoc(
          docRef,
          {
            hours: {
              [day]: {
                time: time,
              },
            },
          },
          { merge: true }
        );
        setCurrentlyLoading(false);
        alert("Hours updated!");
      } catch (e) {
        setCurrentlyLoading(false);
        alert("Please try again.");
      }
    } else {
      setCurrentlyLoading(false);
      alert("Please fix time entry!");
      return;
    }
  };

  const newMenuTimeAlert = (menuUsed, dayUsed, selection, timeUsed) => {
    // console.log(restaurant);
    if (!selection || !menuUsed) {
      alert("Please choose a menu and select a schedule.");
      return;
    }
    Alert.alert(
      "Action",
      `Do you want to change the ${dayUsed} menu to ${menuUsed} for ${selection}?`,
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
            // console.log(menuUsed);
            // console.log(dayUsed);
            // console.log(selection);
            // console.log(timeUsed);
            saveNewMenu(dayUsed, timeUsed, selection, menuUsed);

            return;
          },
        },
      ]
    );
  };

  const saveNewMenu = (day, time, selection, menu) => {
    // console.log(Object.keys(localData.hours[day].menus).length);

    setCurrentlyLoading(true);
    if (
      parseFloat(time.substring(5, 9)) <= parseFloat(time.substring(0, 4)) &&
      selection === "Part Day"
    ) {
      setCurrentlyLoading(false);
      // console.log(time);
      return alert("Issue with Time Selection. Please correct time");
    }
    if (
      Object.keys(localData.hours[day].menus).length === 0 &&
      selection === "Part Day"
    ) {
      // console.log("Made part day 0");
      const docRef = doc(db, "restaurants", localData.name);
      try {
        setDoc(
          docRef,
          {
            hours: {
              [day]: {
                menus: {
                  [menu]: time,
                },
              },
            },
          },
          { merge: true }
        );
        setCurrentlyLoading(false);
        alert("Menu updated!");
      } catch (e) {
        setCurrentlyLoading(false);
        alert("Please try again.");
      }
    }
    if (selection === "All Day") {
      // console.log("made it to all day.");

      const docRef = doc(db, "restaurants", localData.name);

      // console.log(docRef);

      updateDoc(docRef, {
        [`hours.${day}.menus`]: deleteField(),
      }).then(() => {
        try {
          setDoc(
            docRef,
            {
              hours: {
                [day]: {
                  menus: {
                    [menu]: "All Day",
                  },
                },
              },
            },
            { merge: true }
          );
          setCurrentlyLoading(false);
          alert("Menu updated!");
        } catch (e) {
          setCurrentlyLoading(false);
          alert("Please try again.");
        }
      });
    }
    if (
      Object.keys(localData.hours[day].menus).length !== 0 &&
      selection === "Part Day"
    ) {
      // console.log("made it to non 0 part day");
      Promise.all(
        Object.values(localData.hours[day].menus).map((res) => {
          // CHECK FOR ALL DAY CONFLICTS IN MENU OBJECT
          if (res === "All Day") {
            const docRef = doc(db, "restaurants", localData.name);

            let key = getObjKey(localData.hours[day].menus, res);

            updateDoc(docRef, {
              [`hours.${day}.menus.${key}`]: deleteField(),
            });
            alert("All Day Conflict deleted!");
          }
          // CHECK TIMES FOR CONFLICTS
          if (res !== "All Day") {
            // console.log("not all day - time check");
            // console.log(res);
            // console.log(time);
            if (
              (parseFloat(res.substring(0, 4)) <
                parseFloat(time.substring(5, 9)) &&
                parseFloat(res.substring(0, 4)) >
                  parseFloat(time.substring(0, 4))) ||
              (parseFloat(res.substring(5, 9)) <
                parseFloat(time.substring(5, 9)) &&
                parseFloat(res.substring(5, 9)) >
                  parseFloat(time.substring(0, 4))) ||
              parseFloat(res) === parseFloat(time)
            ) {
              // REMOVE CONFLICTED TIMES
              // console.log("found time conflict");
              const docRef = doc(db, "restaurants", localData.name);
              let key = getObjKey(localData.hours[day].menus, res);
              updateDoc(docRef, {
                [`hours.${day}.menus.${key}`]: deleteField(),
              });
              // console.log("conflicts deleted");
              alert("menu conflicts deleted!");
            }
          }
        })
      )
        //AFTER REMOVING AND CHECKING FOR CONFLICTS ADD NEW MENU TIME
        .then(() => {
          // console.log("made it to then statement");
          // console.log(localData.name);
          const docRef = doc(db, "restaurants", localData.name);
          try {
            setDoc(
              docRef,
              {
                hours: {
                  [day]: {
                    menus: {
                      [menu]: time,
                    },
                  },
                },
              },
              { merge: true }
            );
            setCurrentlyLoading(false);
            alert("Menu updated!");
          } catch (e) {
            setCurrentlyLoading(false);
            alert("Please try again.");
          }
        });
    }
  };

  const getObjKey = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  return (
    <AccountBackground>
      <SafeAreaView>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={0}
        >
          <HourScreenWrapper>
            <Spacer size="xxl" />
            <AdminContainer>
              <HoursButton
                mode="contained"
                onPress={() => {
                  setScheduleScreen(true),
                    setMenuScreen(false),
                    setViewScreen(false);
                }}
              >
                Hours
              </HoursButton>
              <HoursButton
                mode="contained"
                onPress={() => {
                  setScheduleScreen(false),
                    setViewScreen(false),
                    setMenuScreen(true);
                }}
              >
                Set Menu
              </HoursButton>
              <HoursButton
                mode="contained"
                onPress={() => {
                  setScheduleScreen(false),
                    setMenuScreen(false),
                    setViewScreen(true);
                }}
              >
                View
              </HoursButton>
            </AdminContainer>
            {menuScreen && (
              <>
                <View
                  style={{
                    justifyContent: "center",

                    alignItems: "center",
                    zIndex: 2000,
                  }}
                >
                  <DropDownContainer>
                    <Spacer size="large">
                      <DropDownPicker
                        style={{
                          borderColor: "#E7E7E7",
                          color: "green",
                          backgroundColor: "#E7E7E7",
                          borderRadius: 5,
                          height: 61,
                          zIndex: 999,
                          width: "100%",
                        }}
                        placeholder="Select A Menu"
                        open={openDays}
                        value={currentDay}
                        items={getDays}
                        setOpen={setOpenDays}
                        setValue={setCurrentDay}
                        setItems={setGetDays}
                        mode="SIMPLE"
                        listMode="SCROLLVIEW"
                        theme="LIGHT"
                        useNativeAndroidPickerStyle={false}
                        selectedItemContainerStyle={{
                          backgroundColor: "#BFBEBE",
                        }}
                        dropDownContainerStyle={{
                          backgroundColor: "#BFBEBE",
                          borderColor: "#E7E7E7",
                        }}
                        onSelectItem={() => {
                          null;
                        }}
                      />
                    </Spacer>
                  </DropDownContainer>
                </View>
                {currentDay && (
                  <>
                    <Spacer size="large" />
                    <View
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
                    >
                      <Spacer size="large" />

                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>Choose Menu For {currentDay} </Text>
                      </View>
                      <MenuCategoryCard>
                        <TouchableOpacity
                          onPress={() => {
                            if (menuListState.length === 0) {
                              Alert.alert(
                                "Please add a menu in           settings -> menu"
                              );
                            } else {
                              setChooseMenuToggle(!chooseMenuToggle),
                                setChooseScheduleToggle(false),
                                setChooseHoursToggle(false);
                            }
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
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  Choose a menu
                                </Text>
                              </>
                            )}
                            {toggleStatus && (
                              <>
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  {toggleStatus}
                                </Text>
                              </>
                            )}
                            {chooseMenuToggle && (
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
                            {!chooseMenuToggle && (
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
                        </TouchableOpacity>
                        {chooseMenuToggle && (
                          <>
                            <ScrollView style={{ maxHeight: 225 }}>
                              {typeof menuListState !== "undefined" && (
                                <>
                                  <RadioButton.Group>
                                    {menuListState.map((r, key) => (
                                      <>
                                        <RadioButton.Item
                                          key={key}
                                          label={r}
                                          onPress={() => {
                                            setToggleStatus(r);
                                          }}
                                          status={
                                            toggleStatus === r
                                              ? "checked"
                                              : "unchecked"
                                          }
                                          value="today"
                                          color="black"
                                        />
                                      </>
                                    ))}
                                  </RadioButton.Group>
                                </>
                              )}
                            </ScrollView>
                          </>
                        )}
                      </MenuCategoryCard>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text>Schedule Menu</Text>
                      </View>
                      <MenuCategoryCard>
                        <TouchableOpacity
                          onPress={() => {
                            setChooseScheduleToggle(!chooseScheduleToggle),
                              setChooseHoursToggle(false),
                              setChooseMenuToggle(false);
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {!schdeuleToggleStatus && (
                              <>
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  Choose schedule
                                </Text>
                              </>
                            )}
                            {schdeuleToggleStatus && (
                              <>
                                <Text
                                  style={{
                                    paddingLeft: 20,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  }}
                                >
                                  {schdeuleToggleStatus}
                                </Text>
                              </>
                            )}
                            {chooseScheduleToggle && (
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
                            {!chooseScheduleToggle && (
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
                        </TouchableOpacity>
                        {chooseScheduleToggle && (
                          <>
                            <ScrollView>
                              <RadioButton.Group>
                                <RadioButton.Item
                                  // key={key}
                                  label="All Day"
                                  onPress={() => {
                                    setSchdeuleToggleStatus("All Day");
                                  }}
                                  status={
                                    schdeuleToggleStatus === "All Day"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  value="today"
                                  color="black"
                                />
                                <RadioButton.Item
                                  // key={key}
                                  label="Part Day"
                                  onPress={() => {
                                    setSchdeuleToggleStatus("Part Day");
                                  }}
                                  status={
                                    schdeuleToggleStatus === "Part Day"
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  value="today"
                                  color="black"
                                />
                              </RadioButton.Group>
                            </ScrollView>
                          </>
                        )}
                      </MenuCategoryCard>

                      <Divider />
                      {schdeuleToggleStatus === "All Day" && (
                        <>
                          <Spacer size="large" />
                        </>
                      )}
                      {!schdeuleToggleStatus && (
                        <>
                          <Spacer size="large" />
                        </>
                      )}

                      {schdeuleToggleStatus === "Part Day" && (
                        <>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text>Choose hours </Text>
                          </View>
                          <MenuCategoryCard>
                            <TouchableOpacity
                              onPress={() => {
                                setChooseScheduleToggle(false),
                                  setChooseMenuToggle(false),
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
                                    <Text
                                      style={{
                                        paddingLeft: 20,
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                      }}
                                    >
                                      Choose hours
                                    </Text>
                                  </>
                                )}
                                {toggleStatus && (
                                  <>
                                    {timeChosen && (
                                      <>
                                        <Text
                                          style={{
                                            paddingLeft: 20,
                                            paddingTop: 5,
                                            paddingBottom: 5,
                                          }}
                                        >
                                          {`${
                                            startHour === 0
                                              ? "12"
                                              : startHour <= 12
                                              ? startHour
                                              : startHour % 12
                                          }:${
                                            startMin < 10 ? "0" : ""
                                          }${startMin} ${
                                            startHour < 12 ? "AM" : "PM"
                                          }`}{" "}
                                          to{" "}
                                          {`${
                                            endHour === 0
                                              ? "12"
                                              : endHour <= 12
                                              ? endHour
                                              : endHour % 12
                                          }:${
                                            endMin < 10 ? "0" : ""
                                          }${endMin} ${
                                            endHour < 12 ? "AM" : "PM"
                                          }`}
                                        </Text>
                                      </>
                                    )}

                                    {!timeChosen && (
                                      <>
                                        <Text
                                          style={{
                                            paddingLeft: 20,
                                            paddingTop: 5,
                                            paddingBottom: 5,
                                          }}
                                        >
                                          Choose Hours
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
                                      Start Time:
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
                                      }:${
                                        startMin < 10 ? "0" : ""
                                      }${startMin} ${
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
                                          setTimeChosen(true);
                                      }
                                    }}
                                  />
                                </View>
                                <Spacer size="large" />
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
                                      paddingLeft: "17%",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      End Time:{" "}
                                    </Text>
                                    <Text
                                      style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      {`${
                                        endHour === 0
                                          ? "12"
                                          : endHour <= 12
                                          ? endHour
                                          : endHour % 12
                                      }:${endMin < 10 ? "0" : ""}${endMin} ${
                                        endHour < 12 ? "AM" : "PM"
                                      }`}
                                    </Text>
                                  </View>

                                  <TimePicker
                                    textStyle={{ fontSize: 19 }}
                                    containerStyle={{ height: 125 }}
                                    value={endTimeValue}
                                    wheelProps={{
                                      wheelHeight: 115,
                                      itemHeight: 19,
                                      height: 150,
                                    }}
                                    onChange={(newValue) =>
                                      setEndTimeValue(newValue)
                                    }
                                  />
                                </View>
                                <Spacer size="large" />
                              </>
                            )}
                          </MenuCategoryCard>
                          <Spacer size="large" />
                        </>
                      )}
                    </View>
                    <Spacer size="large" />
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {!chooseHoursToggle && (
                        <>
                          <ScheduleButton
                            mode="contained"
                            onPress={() =>
                              newMenuTimeAlert(
                                toggleStatus,
                                useCurrentDay,
                                schdeuleToggleStatus,
                                `${startHour < 10 ? "0" : ""}${startHour}${
                                  startMin < 10 ? "0" : ""
                                }${startMin}-${
                                  endHour < 10 ? "0" : ""
                                }${endHour}${endMin < 10 ? "0" : ""}${endMin}`
                              )
                            }
                          >
                            Save Schedule
                          </ScheduleButton>
                        </>
                      )}
                    </View>
                  </>
                )}
              </>
            )}
            {scheduleScreen && (
              <>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2000,
                  }}
                >
                  <DropDownContainer>
                    <Spacer size="large">
                      <DropDownPicker
                        style={{
                          borderColor: "#E7E7E7",
                          color: "green",
                          backgroundColor: "#E7E7E7",
                          borderRadius: 5,
                          height: 61,
                          zIndex: 999,
                          width: "100%",
                        }}
                        placeholder="Select A Menu"
                        open={openDays}
                        value={currentDay}
                        items={getDays}
                        setOpen={setOpenDays}
                        setValue={setCurrentDay}
                        setItems={setGetDays}
                        mode="SIMPLE"
                        listMode="SCROLLVIEW"
                        theme="LIGHT"
                        useNativeAndroidPickerStyle={false}
                        selectedItemContainerStyle={{
                          backgroundColor: "#BFBEBE",
                        }}
                        dropDownContainerStyle={{
                          backgroundColor: "#BFBEBE",
                          borderColor: "#E7E7E7",
                        }}
                        onSelectItem={() => {
                          null;
                        }}
                      />
                    </Spacer>
                  </DropDownContainer>
                </View>
                <Spacer size="large" />
                {currentDay && (
                  <>
                    <View
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
                    >
                      <Spacer size="large" />
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
                            Open Time:
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
                              setStartTimeValue(newValue), setTimeChosen(true);
                            }
                          }}
                        />
                      </View>
                      <Spacer size="large" />
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
                            Close Time:{" "}
                          </Text>
                          <Text
                            style={{
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {`${
                              endHour === 0
                                ? "12"
                                : endHour <= 12
                                ? endHour
                                : endHour % 12
                            }:${endMin < 10 ? "0" : ""}${endMin} ${
                              endHour < 12 ? "AM" : "PM"
                            }`}
                          </Text>
                        </View>
                        <TimePicker
                          textStyle={{ fontSize: 19 }}
                          containerStyle={{ height: 125 }}
                          value={endTimeValue}
                          wheelProps={{
                            wheelHeight: 115,
                            itemHeight: 19,
                            height: 150,
                          }}
                          onChange={(newValue) => setEndTimeValue(newValue)}
                        />
                      </View>
                      <Spacer size="large" />
                    </View>
                    <Spacer size="large" />
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <ScheduleButton
                        mode="contained"
                        onPress={() => {
                          changeTimeAlert(
                            useCurrentDay,
                            `${startHour < 10 ? "0" : ""}${startHour}${
                              startMin < 10 ? "0" : ""
                            }${startMin}-${endHour < 10 ? "0" : ""}${endHour}${
                              endMin < 10 ? "0" : ""
                            }${endMin}`
                          );
                        }}
                      >
                        Save Schedule
                      </ScheduleButton>
                    </View>
                  </>
                )}
              </>
            )}
            {viewScreen && (
              <>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <DropDownContainer style={{ zIndex: 2001 }}>
                    <Spacer size="large">
                      <DropDownPicker
                        style={{
                          borderColor: "#E7E7E7",
                          color: "green",
                          backgroundColor: "#E7E7E7",
                          borderRadius: 5,
                          height: 61,
                          zIndex: 2001,
                          width: "100%",
                        }}
                        placeholder="Select A Menu"
                        open={openDays}
                        value={currentDay}
                        items={getDays}
                        setOpen={setOpenDays}
                        setValue={setCurrentDay}
                        setItems={setGetDays}
                        mode="SIMPLE"
                        listMode="SCROLLVIEW"
                        theme="LIGHT"
                        useNativeAndroidPickerStyle={false}
                        selectedItemContainerStyle={{
                          backgroundColor: "#BFBEBE",
                        }}
                        dropDownContainerStyle={{
                          backgroundColor: "#BFBEBE",
                          borderColor: "#E7E7E7",
                        }}
                        onSelectItem={() => {
                          null;
                        }}
                      />
                    </Spacer>
                  </DropDownContainer>
                  <Spacer size="large" />
                  <View
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.75)",
                      width: "100%",
                    }}
                  >
                    <Spacer size="large" />

                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spacer size="large" />
                      <Text style={{ fontSize: 35 }}>{currentDay} </Text>
                      <Spacer size="small" />
                      {typeof localData?.hours !== "undefined" &&
                        typeof localData?.hours[useCurrentDay] !==
                          "undefined" && (
                          <>
                            <Text style={{ fontSize: 20 }}>
                              Open:{" "}
                              {localData.hours[useCurrentDay].time?.substring(
                                0,
                                4
                              ) < 1200
                                ? localData.hours[
                                    useCurrentDay
                                  ].time?.substring(0, 2) === "00"
                                  ? `12:${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(2, 4)} AM`
                                  : `${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(0, 2)}:${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(2, 4)} AM`
                                : localData.hours[
                                    useCurrentDay
                                  ].time?.substring(0, 4) < 1300
                                ? `${parseFloat(
                                    localData.hours[
                                      useCurrentDay
                                    ].time?.substring(0, 2)
                                  )}:${localData.hours[
                                    useCurrentDay
                                  ].time?.substring(2, 4)} PM`
                                : `${
                                    parseFloat(
                                      localData.hours[
                                        useCurrentDay
                                      ].time?.substring(0, 2)
                                    ) % 12
                                  }:${localData.hours[
                                    useCurrentDay
                                  ].time?.substring(2, 4)} PM`}
                            </Text>
                            <Spacer size="small" />
                            <Text style={{ fontSize: 20 }}>
                              Closed:{" "}
                              {/* {localData.hours[useCurrentDay].time?.substring(
                                5,
                                9
                              )} */}
                              {localData.hours[useCurrentDay].time?.substring(
                                5,
                                9
                              ) < 1200
                                ? localData.hours[
                                    useCurrentDay
                                  ].time?.substring(5, 7) === "00"
                                  ? `12:${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(7, 9)} AM`
                                  : `${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(5, 7)}:${localData.hours[
                                      useCurrentDay
                                    ].time?.substring(7, 9)} AM`
                                : localData.hours[
                                    useCurrentDay
                                  ].time?.substring(5, 9) < 1300
                                ? `${parseFloat(
                                    localData.hours[
                                      useCurrentDay
                                    ].time?.substring(5, 7)
                                  )}:${localData.hours[
                                    useCurrentDay
                                  ].time?.substring(7, 9)} PM`
                                : `${
                                    parseFloat(
                                      localData.hours[
                                        useCurrentDay
                                      ].time?.substring(5, 7)
                                    ) % 12
                                  }:${localData.hours[
                                    useCurrentDay
                                  ].time?.substring(7, 9)} PM`}
                            </Text>
                            <Spacer size="large" />
                            <Text style={{ fontSize: 35 }}>Menus</Text>
                            <Spacer size="small" />
                            <View>
                              {Object.keys(
                                localData.hours[useCurrentDay].menus
                              ).map((keyName, keyIndex) => (
                                <>
                                  <Text style={{ fontSize: 20 }}>
                                    {keyName}:{" "}
                                    {localData.hours[useCurrentDay].menus[
                                      keyName
                                    ] === "All Day"
                                      ? `${localData.hours[useCurrentDay].menus[keyName]}`
                                      : localData.hours[useCurrentDay].menus[
                                          keyName
                                        ]?.substring(0, 4) < 1200
                                      ? localData.hours[useCurrentDay].menus[
                                          keyName
                                        ]?.substring(0, 2) === "00"
                                        ? `12:${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(2, 4)} AM`
                                        : `${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(
                                            0,
                                            2
                                          )}:${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(2, 4)} AM`
                                      : localData.hours[useCurrentDay].menus[
                                          keyName
                                        ]?.substring(0, 4) < 1300
                                      ? `${parseFloat(
                                          localData.hours[useCurrentDay].menus[
                                            keyName
                                          ]?.substring(0, 2)
                                        )}:${localData.hours[
                                          useCurrentDay
                                        ].menus[keyName]?.substring(2, 4)} PM`
                                      : `${
                                          parseFloat(
                                            localData.hours[
                                              useCurrentDay
                                            ].menus[keyName]?.substring(0, 2)
                                          ) % 12
                                        }:${localData.hours[
                                          useCurrentDay
                                        ].menus[keyName]?.substring(2, 4)} PM`}
                                    {localData.hours[useCurrentDay].menus[
                                      keyName
                                    ] === "All Day"
                                      ? ""
                                      : " - "}
                                    {localData.hours[useCurrentDay].menus[
                                      keyName
                                    ] === "All Day"
                                      ? ""
                                      : localData.hours[useCurrentDay].menus[
                                          keyName
                                        ]?.substring(5, 9) < 1200
                                      ? localData.hours[useCurrentDay].menus[
                                          keyName
                                        ]?.substring(5, 7) === "00"
                                        ? `12:${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(7, 9)} AM`
                                        : `${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(
                                            5,
                                            7
                                          )}:${localData.hours[
                                            useCurrentDay
                                          ].menus[keyName]?.substring(7, 9)} AM`
                                      : `${
                                          parseFloat(
                                            localData.hours[
                                              useCurrentDay
                                            ].menus[keyName]?.substring(5, 7)
                                          ) % 12
                                        }:${localData.hours[
                                          useCurrentDay
                                        ].menus[keyName]?.substring(7, 9)} PM`}
                                  </Text>
                                  <Spacer size="small" />
                                </>
                              ))}
                            </View>
                          </>
                        )}
                    </View>
                    <Spacer size="xl" />
                  </View>
                </View>
              </>
            )}
          </HourScreenWrapper>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AccountBackground>
  );
};
