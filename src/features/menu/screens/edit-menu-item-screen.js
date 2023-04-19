/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, View } from "react-native";
import { RadioButton, Switch } from "react-native-paper";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";

import {
  AdminEditContainer,
  AuthButton,
  AuthInput,
  EditBackground,
  EditItemContainer,
  EditOptionInput,
  OptionInput,
  Title,
} from "../../account/components/account.styles";
import { SwitchButtonContainer } from "../../restaurants/components/restaurant-info-card.styles";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../infrastructure/theme/colors";
import { arrayRemove, arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../App";
import { CartPaymentProcessing } from "../../cart/components/cart.styles";

export const EditMenuItem = (props) => {
  const manipulatedProps = props.route.params.props;
  const { isShowingVar, isAvailableVar } = props.route.params;

  const { catUsed, menuUsed, rest, navigation, ...exceptBoth } =
    manipulatedProps;

  const [currentlyLoading, setCurrentlyLoading] = useState(false);

  const [price, setPrice] = useState(exceptBoth.price.toString());
  const [desc, setDesc] = useState(exceptBoth.desc);
  const [menuItemOption, setMenuItemOption] = useState(exceptBoth.firstOptions);
  const [menuItemOptionsName, setMenuItemOptionsName] = useState(
    exceptBoth.firstOptionName
  );
  const [menuItemOptionRequired, setMenuItemOptionRequired] = useState(
    exceptBoth.firstOptionRequired
  );
  const [menuItemOptionMultiple, setMenuItemOptionMultiple] = useState(
    exceptBoth.firstOptionMultiple
  );

  const [moreMenuItemOption, setMoreMenuItemOption] = useState(
    exceptBoth.secondOptions
  );

  const [moreMenuItemOptionsName, setMoreMenuItemOptionsName] = useState(
    exceptBoth.secondOptionName
  );

  const [moreMenuItemOptionRequired, setMoreMenuItemOptionRequired] = useState(
    exceptBoth.secondOptionRequired
  );
  const [moreMenuItemOptionMultiple, setMoreMenuItemOptionMultiple] = useState(
    exceptBoth.secondOptionMultiple
  );
  const [sideOptions, setSideOptions] = useState(exceptBoth.sides);
  const [sidesRequired, setSidesRequired] = useState(exceptBoth.sidesRequired);
  const [ingredientOptions, setIngredientOptions] = useState(
    exceptBoth.ingredient
  );

  //inputs
  const [menuInputOptionName, setMenuInputOptionName] = useState(false);
  const [menuInputOptionPrice, setMenuInputOptionPrice] = useState(0);
  const [moreMenuInputOptionName, setMoreMenuInputOptionName] = useState(false);
  const [moreMenuInputOptionPrice, setMoreMenuInputOptionPrice] = useState(0);
  const [sideOptionName, setSideOptionName] = useState(false);
  const [sideOptionPrice, setSideOptionPrice] = useState(0);
  const [ingredientOption, setIngredientOption] = useState(false);

  const [nutAllergy, setNutAllergy] = useState(
    exceptBoth.allergies[0].nutAllergy
  );
  const [shellfishAllergy, setShellfishAllergy] = useState(
    exceptBoth.allergies[1].shellfishAllergy
  );
  const [wheatAllergy, setWheatAllergy] = useState(
    exceptBoth.allergies[2].wheatAllergy
  );
  const [fishAllergy, setFishAllergy] = useState(
    exceptBoth.allergies[3].fishAllergy
  );
  const [soyAllergy, setSoyAllergy] = useState(
    exceptBoth.allergies[4].soyAllergy
  );
  const [diaryAllergy, setDiaryAllergy] = useState(
    exceptBoth.allergies[5].diaryAllergy
  );
  //ISSUE  this need to be fixed on item creation.
  const [eggAllergy, setEggAllergy] = useState(
    exceptBoth.allergies[6].eggAllergy
  );

  //toggles
  const [showMenuOptions, setShowMenuOptions] = useState(true);
  const [menuItemOptionsNameToggle, setMenuItemOptionsNameToggle] =
    useState(true);
  const [showMenuMoreOptions, setShowMenuMoreOptions] = useState(true);
  const [moreMenuItemOptionsNameToggle, setMoreMenuItemOptionsNameToggle] =
    useState(true);
  const [showMenuSides, setShowMenuSides] = useState(true);
  const [showMenuTemp, setShowMenuTemp] = useState(exceptBoth.showTemp);
  const [tempSelectionRequired, setTempSelectionRequired] = useState(
    exceptBoth.selectTempRequired
  );
  const [showMenuRawWarning, setShowMenuRawWarning] = useState(
    exceptBoth.showRawWarning
  );
  const [showMenuAllergyWarning, setShowMenuAllergyWarning] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);

  // console.log(manipulatedProps);

  //DO NOT REMOVE - exceptBoth is used in update functions

  //Update function

  const updateMenuItem = async () => {
    setCurrentlyLoading(true);

    let tempData = { ...exceptBoth };
    tempData.isShowing = isShowingVar;
    tempData.isAvailable = isAvailableVar;

    //test rest first

    if (!rest) {
      setCurrentlyLoading(false);
      return Alert.alert("Issue accessing restaurant name");
    }

    const docRef = doc(db, "restaurants", rest);

    //data goes here

    const addedMenuItemToCategory = {
      name: exceptBoth.name,
      price: parseFloat(price),
      desc: desc,
      isAvailable: isAvailableVar,
      isShowing: isShowingVar,
      firstOptionName: menuItemOptionsName,
      firstOptionRequired: menuItemOptionRequired,
      firstOptionMultiple: menuItemOptionMultiple,
      firstOptions: menuItemOption,
      secondOptionName: moreMenuItemOptionsName,
      secondOptionRequired: moreMenuItemOptionRequired,
      secondOptionMultiple: moreMenuItemOptionMultiple,
      secondOptions: moreMenuItemOption,
      sides: sideOptions,
      sidesRequired: sidesRequired,
      showTemp: showMenuTemp,
      selectTempRequired: tempSelectionRequired,
      showRawWarning: showMenuRawWarning,
      allergies: [
        { nutAllergy: nutAllergy },
        { shellfishAllergy: shellfishAllergy },
        { wheatAllergy: wheatAllergy },
        { fishAllergy: fishAllergy },
        { soyAllergy: soyAllergy },
        { diaryAllergy: diaryAllergy },
        { eggAllergy: eggAllergy },
      ],
      ingredient: ingredientOptions,
    };

    if (!menuUsed) {
      setCurrentlyLoading(false);
      return Alert.alert("Issue accessing menu name");
    }

    if (!catUsed) {
      setCurrentlyLoading(false);
      return Alert.alert("Issue accessing category used");
    }

    if (!exceptBoth.name | !price) {
      setCurrentlyLoading(false);
      return Alert.alert("Issue getting item name and price");
    }

    try {
      setDoc(
        docRef,
        {
          menus: {
            [menuUsed]: {
              [catUsed]: arrayUnion(addedMenuItemToCategory),
            },
          },
        },
        { merge: true }
      ).then(() => {
        setDoc(
          docRef,
          {
            menus: {
              [menuUsed]: {
                [catUsed]: arrayRemove(tempData),
              },
            },
          },
          { merge: true }
        ).then(() => {
          setCurrentlyLoading(false);
          navigation.goBack();
          Alert.alert("Menu item updated!");
        });
      });
    } catch (e) {
      setCurrentlyLoading(false);
      Alert.alert("Please try again.");
    }
  };

  const addMenuInputOption = () => {
    setMenuItemOption((oldArray) => [
      ...oldArray,
      {
        name: menuInputOptionName,
        price: menuInputOptionPrice,
      },
    ]);

    setMenuInputOptionName("");
    setMenuInputOptionPrice(0);
  };

  const addMoreMenuInputOption = () => {
    setMoreMenuItemOption((oldArray) => [
      ...oldArray,
      {
        name: moreMenuInputOptionName,
        price: moreMenuInputOptionPrice,
      },
    ]);

    setMoreMenuInputOptionName("");
    setMoreMenuInputOptionPrice(0);
  };

  const addSideOption = () => {
    setSideOptions((oldArray) => [
      ...oldArray,
      {
        name: sideOptionName,
        price: sideOptionPrice,
      },
    ]);

    setSideOptionName("");
    setSideOptionPrice(0);
  };

  const addIngredientOption = () => {
    setIngredientOptions((oldArray) => [
      ...oldArray,
      {
        name: ingredientOption,
      },
    ]);

    setIngredientOption("");
  };

  const twoButtonAlert = (func, option) => {
    Alert.alert("Action", "Are you sure you want to delete this?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          func(option);
          return;
        },
      },
    ]);
  };

  const updateAlert = () => {
    Alert.alert("Action", "Are you sure you want to update this item?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          updateMenuItem();
          return;
        },
      },
    ]);
  };

  const deleteMenuItem = (target) => {
    setMenuItemOption(menuItemOption.filter((v) => v.name !== target.name));
  };

  const deleteMoreMenuItem = (target) => {
    setMoreMenuItemOption(
      moreMenuItemOption.filter((v) => v.name !== target.name)
    );
  };
  const deleteSideOption = (target) => {
    setSideOptions(sideOptions.filter((v) => v.name !== target.name));
  };
  const deleteIngredientOption = (target) => {
    setIngredientOptions(
      ingredientOptions.filter((v) => v.name !== target.name)
    );
  };

  //   console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  //   console.log("exceptboth: ", exceptBoth.name);
  return (
    <EditBackground>
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
          {currentlyLoading && (
            <View
              style={{
                zIndex: 999,
                justifyContent: "center",
                alignItems: "center",
                top: "50%",
              }}
            >
              <CartPaymentProcessing />
            </View>
          )}
          <AdminEditContainer>
            <ScrollView>
              <EditItemContainer>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Title>Editing: {exceptBoth.name}</Title>
                  <Spacer size="large">
                    <AuthInput
                      label="Price (Example: 3.99)"
                      value={price}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(u) => setPrice(u)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Desc"
                      value={desc}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(d) => setDesc(d)}
                    />
                  </Spacer>
                </View>
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <SwitchButtonContainer>
                    <Spacer size="large" />
                    <Text>Add Menu Item Options (Example: select size)</Text>
                    <Switch
                      onChange={() => (
                        setShowMenuOptions(!showMenuOptions),
                        setMenuItemOptionsNameToggle(
                          !menuItemOptionsNameToggle
                        ),
                        !showMenuOptions && setMenuItemOption([]),
                        !showMenuOptions && setMenuItemOptionsName(null),
                        !showMenuOptions && setMenuItemOptionRequired(false),
                        !showMenuOptions && setMenuItemOptionMultiple(false)
                      )}
                      value={showMenuOptions}
                    />
                  </SwitchButtonContainer>
                </View>

                {showMenuOptions && (
                  <>
                    <Spacer size="large" />
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <RadioButton.Group>
                        <RadioButton.Item
                          label="Make selection required?"
                          onPress={() =>
                            setMenuItemOptionRequired(!menuItemOptionRequired)
                          }
                          status={
                            menuItemOptionRequired ? "checked" : "unchecked"
                          }
                          value={menuItemOptionRequired}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Allow multiple selections?"
                          onPress={() =>
                            setMenuItemOptionMultiple(!menuItemOptionMultiple)
                          }
                          status={
                            menuItemOptionMultiple ? "checked" : "unchecked"
                          }
                          value={menuItemOptionMultiple}
                          color="black"
                        />
                      </RadioButton.Group>
                      <Spacer size="small" />
                      <AuthInput
                        label="Options title (Ex: salad dressings)"
                        value={menuItemOptionsName}
                        keyboardType="default"
                        autoCapitalize="none"
                        onChangeText={(mion) => setMenuItemOptionsName(mion)}
                      />
                    </View>
                  </>
                )}

                {menuItemOptionsNameToggle && showMenuOptions && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <EditOptionInput
                          label="Option Name (Ex: Pepperoni)"
                          value={menuInputOptionName}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(op) => setMenuInputOptionName(op)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <EditOptionInput
                          label="Option Price (Ex: 3.99)"
                          value={menuInputOptionPrice}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(opp) => setMenuInputOptionPrice(opp)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          onPress={() => {
                            if (menuInputOptionName) {
                              addMenuInputOption();
                            } else {
                              Alert.alert("Enter option name");
                            }
                          }}
                        >
                          Add Option
                        </AuthButton>
                      </Spacer>
                    </View>
                    {menuItemOptionsNameToggle &&
                      showMenuOptions &&
                      menuItemOption[0] && (
                        <>
                          <View>
                            <Spacer size="large" />
                            <ScrollView
                              horizontal
                              showsHorizontalScrollInsdicator={false}
                              style={{ height: 50 }}
                            >
                              {menuItemOption.map((option) => {
                                const key = option.name;
                                return (
                                  <Spacer
                                    key={key}
                                    position="left"
                                    size="medium"
                                  >
                                    <TouchableOpacity
                                      style={{
                                        backgroundColor: colors.brand.primary,
                                        borderRadius: 10,
                                        padding: 4,
                                        justifyContent: "center",
                                      }}
                                      onPress={() => {
                                        twoButtonAlert(deleteMenuItem, option);
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
                                        {option.name} :
                                        {option.price
                                          ? ` $${option.price}`
                                          : " $0"}
                                      </Text>
                                    </TouchableOpacity>
                                  </Spacer>
                                );
                              })}
                              <Spacer size="xl" position="right" />
                            </ScrollView>
                          </View>
                        </>
                      )}
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <SwitchButtonContainer>
                    <Spacer size="large" />
                    <Text>Add More Item Options (Example: select size)</Text>
                    <Switch
                      onChange={() => (
                        setShowMenuMoreOptions(!showMenuMoreOptions),
                        setMoreMenuItemOptionsNameToggle(
                          !moreMenuItemOptionsNameToggle
                        ),
                        !showMenuMoreOptions && setMoreMenuItemOption([]),
                        !showMenuMoreOptions &&
                          setMoreMenuItemOptionsName(null),
                        !showMenuMoreOptions &&
                          setMoreMenuItemOptionRequired(false),
                        !showMenuMoreOptions &&
                          setMoreMenuItemOptionMultiple(false)
                      )}
                      value={showMenuMoreOptions}
                    />
                  </SwitchButtonContainer>
                </View>
                {showMenuMoreOptions && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large" />
                      <RadioButton.Group>
                        <RadioButton.Item
                          label="Make selection required?"
                          onPress={() =>
                            setMoreMenuItemOptionRequired(
                              !moreMenuItemOptionRequired
                            )
                          }
                          status={
                            moreMenuItemOptionRequired ? "checked" : "unchecked"
                          }
                          value={moreMenuItemOptionRequired}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Allow multiple selections?"
                          onPress={() =>
                            setMoreMenuItemOptionMultiple(
                              !moreMenuItemOptionMultiple
                            )
                          }
                          status={
                            moreMenuItemOptionMultiple ? "checked" : "unchecked"
                          }
                          value={moreMenuItemOptionMultiple}
                          color="black"
                        />
                      </RadioButton.Group>
                      <Spacer size="small" />
                      <AuthInput
                        label="Options title (Ex: toppings)"
                        value={moreMenuItemOptionsName}
                        keyboardType="default"
                        autoCapitalize="none"
                        onChangeText={(mion) =>
                          setMoreMenuItemOptionsName(mion)
                        }
                      />
                    </View>
                  </>
                )}

                {showMenuMoreOptions && moreMenuItemOptionsNameToggle && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <EditOptionInput
                          label="Option Name (Ex: Pepperoni)"
                          value={moreMenuInputOptionName}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(op) => setMoreMenuInputOptionName(op)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <EditOptionInput
                          label="Option Price (Ex: 3.99)"
                          value={moreMenuInputOptionPrice}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(opp) =>
                            setMoreMenuInputOptionPrice(opp)
                          }
                        />
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          onPress={() => {
                            if (moreMenuInputOptionName) {
                              addMoreMenuInputOption();
                            } else {
                              Alert.alert("Enter option name");
                            }
                          }}
                        >
                          Add Option
                        </AuthButton>
                      </Spacer>
                    </View>
                    {showMenuMoreOptions &&
                      moreMenuItemOptionsNameToggle &&
                      moreMenuItemOption[0] && (
                        <>
                          <View>
                            <Spacer size="large" />
                            <ScrollView
                              horizontal
                              showsHorizontalScrollInsdicator={false}
                              style={{ height: 50 }}
                            >
                              {moreMenuItemOption.map((option) => {
                                const key = option.name;
                                return (
                                  <Spacer
                                    key={key}
                                    position="left"
                                    size="medium"
                                  >
                                    <TouchableOpacity
                                      style={{
                                        backgroundColor: colors.brand.primary,
                                        borderRadius: 10,
                                        padding: 4,
                                        justifyContent: "center",
                                      }}
                                      onPress={() => {
                                        twoButtonAlert(
                                          deleteMoreMenuItem,
                                          option
                                        );
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
                                        {option.name} :
                                        {option.price
                                          ? ` $${option.price}`
                                          : " $0"}
                                      </Text>
                                    </TouchableOpacity>
                                  </Spacer>
                                );
                              })}
                              <Spacer size="xl" position="right" />
                            </ScrollView>
                          </View>
                        </>
                      )}
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <SwitchButtonContainer>
                    <Spacer size="large" />
                    <Text>Add Sides (Example: fries or a side of okra)</Text>
                    <Switch
                      onChange={() => {
                        setShowMenuSides(!showMenuSides),
                          !showMenuSides && setSideOptions([]),
                          setSidesRequired(false);
                      }}
                      value={showMenuSides}
                    />
                  </SwitchButtonContainer>
                </View>
                {showMenuSides && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <RadioButton.Group>
                          <RadioButton.Item
                            label="Make selection required?"
                            onPress={() => {
                              setSidesRequired(!sidesRequired),
                                !showMenuSides && setSidesRequired(false);
                            }}
                            status={sidesRequired ? "checked" : "unchecked"}
                            value={sidesRequired}
                            color="black"
                          />
                        </RadioButton.Group>
                        <Spacer size="small" />
                        <EditOptionInput
                          label="Side Name (Ex: Fries)"
                          value={sideOptionName}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(son) => setSideOptionName(son)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <EditOptionInput
                          label="Option Price (Ex: 3.99)"
                          value={sideOptionPrice}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(sop) => setSideOptionPrice(sop)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          onPress={() => {
                            if (sideOptionName) {
                              addSideOption();
                            } else {
                              Alert.alert("Enter option name");
                            }
                          }}
                        >
                          Add Option
                        </AuthButton>
                      </Spacer>
                    </View>
                    {showMenuSides && sideOptions[0] && (
                      <>
                        <View>
                          <Spacer size="large" />
                          <ScrollView
                            horizontal
                            showsHorizontalScrollInsdicator={false}
                            style={{ height: 50 }}
                          >
                            {sideOptions.map((option) => {
                              const key = option.name;
                              return (
                                <Spacer key={key} position="left" size="medium">
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: colors.brand.primary,
                                      borderRadius: 10,
                                      padding: 4,
                                      justifyContent: "center",
                                    }}
                                    onPress={() => {
                                      twoButtonAlert(deleteSideOption, option);
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
                                      {option.name} :
                                      {option.price
                                        ? ` $${option.price}`
                                        : " $0"}
                                    </Text>
                                  </TouchableOpacity>
                                </Spacer>
                              );
                            })}
                            <Spacer size="xl" position="right" />
                          </ScrollView>
                        </View>
                      </>
                    )}
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <SwitchButtonContainer>
                    <Spacer size="large" />
                    <Text>Show Temp (For Meats)</Text>
                    <Switch
                      onChange={() => {
                        setShowMenuTemp(!showMenuTemp),
                          !showMenuTemp && setTempSelectionRequired(false);
                      }}
                      value={showMenuTemp}
                    />
                  </SwitchButtonContainer>
                </View>
                {showMenuTemp && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <RadioButton.Group>
                          <RadioButton.Item
                            label="Make selection required?"
                            onPress={() =>
                              setTempSelectionRequired(!tempSelectionRequired)
                            }
                            status={
                              tempSelectionRequired ? "checked" : "unchecked"
                            }
                            value={tempSelectionRequired}
                            color="black"
                          />
                        </RadioButton.Group>
                        <Spacer size="small" />
                        <Text>
                          *Tempature selction will show up for this menu item on
                          the user end. If no selection is made, assume Medium
                          as default*
                        </Text>
                      </Spacer>
                    </View>
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <SwitchButtonContainer>
                    <Spacer size="large" />
                    <Text>Add Raw Warning</Text>
                    <Switch
                      onChange={() =>
                        setShowMenuRawWarning(!showMenuRawWarning)
                      }
                      value={showMenuRawWarning}
                    />
                  </SwitchButtonContainer>
                </View>
                {showMenuRawWarning && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <Text>
                          *Raw warning will show up for this menu item on the
                          user end*
                        </Text>
                      </Spacer>
                    </View>
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <Spacer size="large">
                    <SwitchButtonContainer>
                      <Text>Add Allergy Warnings</Text>
                      <Switch
                        onChange={() =>
                          setShowMenuAllergyWarning(!showMenuAllergyWarning)
                        }
                        value={showMenuAllergyWarning}
                      />
                    </SwitchButtonContainer>
                  </Spacer>
                </View>
                {showMenuAllergyWarning && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="small">
                        <Text>Select Allergies</Text>
                      </Spacer>

                      <RadioButton.Group>
                        <RadioButton.Item
                          label="Nut Allergy"
                          onPress={() => setNutAllergy(!nutAllergy)}
                          status={nutAllergy ? "checked" : "unchecked"}
                          value={nutAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Fish Allergy"
                          onPress={() => setFishAllergy(!fishAllergy)}
                          status={fishAllergy ? "checked" : "unchecked"}
                          value={fishAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Shellfish Allergy"
                          onPress={() => setShellfishAllergy(!shellfishAllergy)}
                          status={shellfishAllergy ? "checked" : "unchecked"}
                          value={shellfishAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Diary Allergy"
                          onPress={() => setDiaryAllergy(!diaryAllergy)}
                          status={diaryAllergy ? "checked" : "unchecked"}
                          value={diaryAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Soy Allergy"
                          onPress={() => setSoyAllergy(!soyAllergy)}
                          status={soyAllergy ? "checked" : "unchecked"}
                          value={soyAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Wheat Allergy"
                          onPress={() => setWheatAllergy(!wheatAllergy)}
                          status={wheatAllergy ? "checked" : "unchecked"}
                          value={wheatAllergy}
                          color="black"
                        />
                        <RadioButton.Item
                          label="Egg Allergy"
                          onPress={() => setEggAllergy(!eggAllergy)}
                          status={eggAllergy ? "checked" : "unchecked"}
                          value={eggAllergy}
                          color="black"
                        />
                      </RadioButton.Group>
                    </View>
                  </>
                )}
                <View style={{ justifyContent: "left", alignItems: "left" }}>
                  <Spacer size="large">
                    <SwitchButtonContainer>
                      <Text>Add Ingredients</Text>
                      <Switch
                        value={showIngredients}
                        onChange={() => {
                          setShowIngredients(!showIngredients),
                            !showIngredients && setIngredientOptions([]);
                        }}
                      />
                    </SwitchButtonContainer>
                  </Spacer>
                </View>
                {showIngredients && (
                  <>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <EditOptionInput
                          label="Add Ingredient (Ex: salt)"
                          value={ingredientOption}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(sio) => setIngredientOption(sio)}
                        />
                      </Spacer>

                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          onPress={addIngredientOption}
                        >
                          Add Ingredient
                        </AuthButton>
                      </Spacer>
                    </View>
                    {showIngredients && ingredientOptions[0] && (
                      <>
                        <View>
                          <Spacer size="large" />
                          <ScrollView
                            horizontal
                            showsHorizontalScrollInsdicator={false}
                            style={{ height: 50 }}
                          >
                            {ingredientOptions.map((option) => {
                              const key = option.name;
                              return (
                                <Spacer key={key} position="left" size="medium">
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: "#FF4788",
                                      borderRadius: 10,
                                      padding: 7,
                                    }}
                                    onPress={() => {
                                      twoButtonAlert(
                                        deleteIngredientOption,
                                        option
                                      );
                                    }}
                                  >
                                    <Text
                                      variant="caption"
                                      style={{ fontSize: 15 }}
                                    >
                                      {option.name}
                                    </Text>
                                  </TouchableOpacity>
                                </Spacer>
                              );
                            })}
                            <Spacer size="xl" position="right" />
                          </ScrollView>
                        </View>
                      </>
                    )}
                  </>
                )}

                {/* <Spacer size="large">
                    <AuthInput
                      label="Include Temp Selection: True or false?"
                      value={temp}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(d) => setTemp(d)}
                    />
                  </Spacer> */}
                <Spacer size="large" />
                <Spacer size="large" />
                <Spacer size="large">
                  <AuthButton mode="contained" onPress={updateAlert}>
                    Update
                  </AuthButton>
                </Spacer>
              </EditItemContainer>
            </ScrollView>
          </AdminEditContainer>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </EditBackground>
  );
};
