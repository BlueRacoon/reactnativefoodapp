/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider, RadioButton } from "react-native-paper";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { colors } from "../../../infrastructure/theme/colors";
import { CartContext } from "../../../services/cart/cart.context";
import {
  AdminContainer,
  ButtonContainer,
  CartFullContainer,
  DropDownContainer,
  MenuItemBackground,
  MenuItemContainer,
  MenuItemContainerName,
  MenuItemDropDownContainer,
  MenuItemText,
  MenuItemTitleContainer,
  MenuTitleContainer,
  ModifyItemTitle,
  RawWarningMenuItemText,
  OrderTitleContainer,
  Title,
  SelectionRequiredText,
} from "../../account/components/account.styles";
import { OrderButton } from "./restaurant-list.styles";
import NumericInput from "react-native-numeric-input";
import { set } from "react-native-reanimated";

export const RestaurantItemScreen = (props) => {
  const manipulatedProps = props;
  const { rest, navigation, item } = manipulatedProps;
  const { addToCart, keyFunction, cart, updateCart } = useContext(CartContext);
  const [itemPrice, setItemPrice] = useState(props.route.params.item.price);
  const [firstOptionChoice, setFirstOptionChoice] = useState([]);
  const [firstOptionPrice, setFirstOptionPrice] = useState(0);
  const [secondOptionChoice, setSecondOptionChoice] = useState([]);
  const [secondOptionPrice, setSecondOptionPrice] = useState(0);
  const [sideChoice, setSideChoice] = useState(null);
  const [sidePrice, setSidePrice] = useState(0);
  const [openTemp, setOpenTemp] = useState(false);
  const [valueTemp, setValueTemp] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tempCart, setTempCart] = useState(cart);
  const [allergyArray, setAllergyArray] = useState([]);
  const [getTemps, setGetTemps] = useState([
    {
      label: "rare",
      value: "rare",
    },
    {
      label: "medium-rare",
      value: "medium-rare",
    },
    {
      label: "medium",
      value: "medium",
    },
    {
      label: "medium-well",
      value: "medium-well",
    },
    {
      label: "well",
      value: "well",
    },
  ]);

  // console.log(props.route.params.item);

  useEffect(() => {
    // if (
    //   props.route.params.item.firstOptionsMultiple === false &&
    //   !props.route.params.item.secondOptionsMultiple === false
    // ) {
    // console.log("FOP", firstOptionPrice);
    // console.log("SOP", secondOptionPrice);
    setItemPrice(
      parseFloat(
        parseFloat(props.route.params.item.price) +
          parseFloat(firstOptionPrice) +
          parseFloat(secondOptionPrice) +
          parseFloat(sidePrice)
      ).toFixed(2)
    );
    // } else {
    //   let tempPriceFirst = 0;
    //   let tempFirstOptionPrice;
    //   let tempPriceSecond = 0;
    //   let tempSecondOptionPrice;
    //   typeof firstOptionChoice === "object"
    //     ? (tempFirstOptionPrice = firstOptionChoice.map(
    //         (selection) => (tempPriceFirst = tempPriceFirst + selection.price)
    //       ))
    //     : firstOptionChoice.price;
    //   console.log("TFOP", tempFirstOptionPrice);
    //   typeof secondOptionChoice === "object"
    //     ? (tempSecondOptionPrice = secondOptionChoice.map(
    //         (selection) => (tempPriceSecond = tempPriceSecond + selection.price)
    //       ))
    //     : secondOptionChoice.price;
    //   console.log("TSOP", tempSecondOptionPrice);
    //   setItemPrice(
    //     parseFloat(
    //       parseFloat(props.route.params.item.price) +
    //         parseFloat(tempFirstOptionPrice) +
    //         parseFloat(tempSecondOptionPrice) +
    //         parseFloat(sidePrice)
    //     ).toFixed(2)
    //   );
    // }
  }, [
    secondOptionPrice,
    sidePrice,
    firstOptionPrice,
    props.route.params.item.price,
  ]);

  const setFirstOption = (price, name) => {
    // console.log(price, name);
    // console.log("FOC", firstOptionChoice);
    return new Promise((resolve, reject) => {
      let tempPrice = 0;
      // console.log(props.route.params.item.firstOptionMultiple);
      props.route.params.item.firstOptionMultiple === false
        ? price === 0 || !price
          ? // console.log("nonmultiple"),
            (setFirstOptionPrice(0), setFirstOptionChoice([name]), resolve())
          : (setFirstOptionPrice(price),
            setFirstOptionChoice([name]),
            resolve())
        : !firstOptionChoice
        ? (setFirstOptionPrice(price), setFirstOptionChoice([name]), resolve())
        : firstOptionChoice.includes(name) === false
        ? firstOptionChoice.length === 0
          ? // console.log("multiple, doesn't include name, and length is 0."),
            ((tempPrice = parseFloat(price) + parseFloat(firstOptionPrice)),
            // console.log(tempPrice),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray) => [...oldArray, name]),
            resolve())
          : //   console.log("multiple map & doesnt include name"),
            // console.log(firstOptionChoice),
            ((tempPrice = parseFloat(price) + parseFloat(firstOptionPrice)),
            setFirstOptionPrice(tempPrice),
            setFirstOptionChoice((oldArray) => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(
            parseFloat(firstOptionPrice) - parseFloat(price),
            0
          )),
          // console.log("TP", tempPrice),
          setFirstOptionPrice(tempPrice),
          setFirstOptionChoice(firstOptionChoice.filter((v) => v !== name)),
          // console.log("FOC", firstOptionChoice),
          resolve());
    });
  };

  const setSecondOption = (price, name) => {
    // console.log(price, name);
    // console.log("FOC", firstOptionChoice);
    return new Promise((resolve, reject) => {
      let tempPrice = 0;
      // console.log(props.route.params.item.firstOptionMultiple);
      props.route.params.item.secondOptionMultiple === false
        ? price === 0 || !price
          ? // console.log("nonmultiple"),
            (setSecondOptionPrice(0), setSecondOptionChoice([name]), resolve())
          : (setSecondOptionPrice(price),
            setSecondOptionChoice([name]),
            resolve())
        : !secondOptionChoice
        ? (setSecondOptionPrice(price),
          setSecondOptionChoice([name]),
          resolve())
        : secondOptionChoice.includes(name) === false
        ? secondOptionChoice.length === 0
          ? // console.log("multiple, doesn't include name, and length is 0."),
            ((tempPrice = parseFloat(price) + parseFloat(secondOptionPrice)),
            // console.log(tempPrice),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray) => [...oldArray, name]),
            resolve())
          : //   console.log("multiple map & doesnt include name"),
            // console.log(firstOptionChoice),
            ((tempPrice = parseFloat(price) + parseFloat(secondOptionPrice)),
            setSecondOptionPrice(tempPrice),
            setSecondOptionChoice((oldArray) => [...oldArray, name]),
            resolve())
        : ((tempPrice = Math.max(
            parseFloat(secondOptionPrice) - parseFloat(price),
            0
          )),
          // console.log("TP", tempPrice),
          setSecondOptionPrice(tempPrice),
          setSecondOptionChoice(secondOptionChoice.filter((v) => v !== name)),
          // console.log("FOC", firstOptionChoice),
          resolve());
    });
  };

  const setSideOption = (price, name) => {
    return new Promise((resolve, reject) => {
      if (price === 0 || !price) {
        setSidePrice(0);
        setSideChoice(name);
        resolve();
      } else {
        setSidePrice(price);
        setSideChoice(name);
        resolve();
      }
    });
  };

  const fillTempCart = async () => {
    let tempCartArray;
    cart.length > 0 ? (tempCartArray = cart) : (tempCartArray = []);
    return new Promise(async (resolve, reject) => {
      for (let i = 1; i <= quantity; i++) {
        let tempKey = await keyFunction(props.route.params.item.name);
        let uniqueFirstOptionChoices = [...new Set(firstOptionChoice)];
        let uniqueSecondOptionChoices = [...new Set(secondOptionChoice)];

        const getallData = {
          item: props.route.params.item.name,
          id: tempKey,
          price: parseFloat(itemPrice * 100),
          modifiers: [
            ...uniqueFirstOptionChoices,
            // secondOptionChoice,
            ...uniqueSecondOptionChoices,
            sideChoice,
            valueTemp,
          ],
        };
        (await tempCartArray.length) > 0
          ? (tempCartArray = [...tempCartArray, getallData])
          : (tempCartArray = [getallData]);
        if (i === quantity) {
          resolve(tempCartArray);
        }
      }
    });
  };

  const fillTempCartNoModifiers = async () => {
    let tempCartArray;
    cart.length > 0 ? (tempCartArray = cart) : (tempCartArray = []);
    return new Promise(async (resolve, reject) => {
      for (let i = 1; i <= quantity; i++) {
        let tempKey = await keyFunction(props.route.params.item.name);
        const getallData = {
          item: props.route.params.item.name,
          id: tempKey,
          price: parseFloat(itemPrice * 100),
          modifiers: [],
        };
        (await tempCartArray.length) > 0
          ? (tempCartArray = [...tempCartArray, getallData])
          : (tempCartArray = [getallData]);
        if (i === quantity) {
          resolve(tempCartArray);
        }
      }
    });
  };

  const finishItem = async () => {
    if (props.route.params.item.selectTempRequired && valueTemp === null) {
      Alert.alert("Please make selections on required sections");
      return;
    }
    if (
      props.route.params.item.firstOptionRequired &&
      firstOptionChoice.length === 0
    ) {
      Alert.alert("Please make selections on required sections");
      return;
    }
    if (
      props.route.params.item.secondOptionRequired &&
      secondOptionChoice.length === 0
    ) {
      Alert.alert("Please make selections on required sections");
      return;
    }
    if (props.route.params.item.sidesRequired && sideChoice === null) {
      Alert.alert("Please make selections on required sections");
      return;
    }

    if (firstOptionChoice || secondOptionChoice || sideChoice || valueTemp) {
      if (quantity > 1) {
        fillTempCart().then((res) => {
          updateCart(res, props.route.params.restaurant);
          navigation.goBack();
        });
      } else {
        let tempKey = await keyFunction(props.route.params.item.name);
        //remove duplicates from first option  array
        let uniqueFirstOptionChoices = [...new Set(firstOptionChoice)];
        let uniqueSecondOptionChoices = [...new Set(secondOptionChoice)];

        addToCart(
          {
            item: props.route.params.item.name,
            id: tempKey,
            price: parseFloat(itemPrice * 100),
            modifiers: [
              ...uniqueFirstOptionChoices,
              ...uniqueSecondOptionChoices,
              sideChoice,
              valueTemp,
            ],
          },
          props.route.params.restaurant
        );

        navigation.goBack();
      }
    } else {
      if (quantity > 1) {
        fillTempCartNoModifiers().then((res) => {
          updateCart(res, props.route.params.restaurant);
          navigation.goBack();
        });
      } else {
        let tempKey = await keyFunction(props.route.params.item.name);
        addToCart(
          {
            item: props.route.params.item.name,
            id: tempKey,
            price: parseFloat(itemPrice * 100),
            modifiers: [],
          },
          props.route.params.restaurant
        );

        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    let tempArray = [];
    props.route.params.item.allergies.map((object) => {
      const [key, value] = Object.entries(object)[0];
      value === true ? tempArray.push(key) : null;
    });
    setAllergyArray(tempArray);
  }, []);

  return (
    <>
      <OrderTitleContainer>
        <Spacer size="small" />
        <ModifyItemTitle labelStyle={{ fontSize: 16 }} type="text">
          Modify Your Item Below
        </ModifyItemTitle>
        <Spacer size="small" />
      </OrderTitleContainer>

      <ScrollView>
        <CartFullContainer>
          <MenuItemContainer>
            <MenuItemContainerName>
              <MenuItemText>{props.route.params.item.name}</MenuItemText>
              <MenuItemText>
                {" "}
                {parseFloat(itemPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </MenuItemText>
            </MenuItemContainerName>
            <Spacer size="large" />
            {props.route.params.item.desc && (
              <>
                <MenuItemText>{props.route.params.item.desc}</MenuItemText>
                <Spacer size="large" />
              </>
            )}
            {props.route.params.item.ingredient &&
              props.route.params.item.ingredient[0] && (
                <>
                  <Divider />
                  <Spacer size="large" />
                  <MenuItemText>Ingredients:</MenuItemText>

                  <Spacer size="large" />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollInsdicator={false}
                    style={{ height: 50 }}
                  >
                    {props.route.params.item.ingredient.map((option) => {
                      return (
                        <Spacer position="left" size="medium">
                          <TouchableOpacity
                            style={{
                              backgroundColor: colors.brand.primary,
                              borderRadius: 10,
                              padding: 7,
                              color: "white",
                            }}
                          >
                            <Text
                              variant="caption"
                              style={{ fontSize: 15, color: "white" }}
                            >
                              {option.name}
                            </Text>
                          </TouchableOpacity>
                        </Spacer>
                      );
                    })}
                  </ScrollView>
                </>
              )}
            <Spacer size="small" />
            {props.route.params.item.allergies && allergyArray.length > 0 && (
              <>
                <Divider />
                <Spacer size="large" />
                <MenuItemText>Allergy Warnings:</MenuItemText>

                <Spacer size="large" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollInsdicator={false}
                  style={{ height: 50 }}
                >
                  {props.route.params.item.allergies.map((option) => {
                    const [key, value] = Object.entries(option)[0];
                    {
                    }
                    if (value === true) {
                      return (
                        <Spacer position="left" size="medium">
                          <TouchableOpacity
                            style={{
                              backgroundColor: colors.brand.primary,
                              borderRadius: 10,
                              padding: 7,
                              color: "white",
                            }}
                          >
                            <Text
                              variant="caption"
                              style={{ fontSize: 15, color: "white" }}
                            >
                              {key.slice(0, key.length - 7)}
                            </Text>
                          </TouchableOpacity>
                        </Spacer>
                      );
                    }
                  })}
                </ScrollView>
              </>
            )}
            <Spacer size="small" />
            {props.route.params.item.showTemp && (
              <>
                <Divider />
                <Spacer size="large" />
                <MenuItemContainerName>
                  <MenuItemText>Select temperature:</MenuItemText>
                  {props.route.params.item.selectTempRequired && (
                    <View style={{ justifyContent: "center" }}>
                      <SelectionRequiredText>
                        *Selection Required
                      </SelectionRequiredText>
                    </View>
                  )}
                </MenuItemContainerName>
                <Spacer size="large" />
                <MenuItemDropDownContainer zIndex={1000}>
                  <DropDownPicker
                    style={{
                      borderColor: "#E7E7E7",
                      color: "white",
                      backgroundColor: "white",
                      borderRadius: 5,
                      height: 61,
                    }}
                    inputIOS={{
                      color: "black",
                      fontSize: 35,
                    }}
                    placeholder="Temperature selection"
                    open={openTemp}
                    value={valueTemp}
                    items={getTemps}
                    setOpen={setOpenTemp}
                    setValue={setValueTemp}
                    setItems={setGetTemps}
                    mode="SIMPLE"
                    listMode="SCROLLVIEW"
                    theme="LIGHT"
                    useNativeAndroidPickerStyle={false}
                    dropDownContainerStyle={{
                      backgroundColor: "#BFBEBE",
                      borderColor: "#E7E7E7",
                    }}
                    onSelectItem={(item) => {
                      //   console.log(item);
                    }}
                  />
                </MenuItemDropDownContainer>
                {props.route.params.item.showRawWarning && (
                  <>
                    <Spacer size="small" />
                    <RawWarningMenuItemText style={{ paddingLeft: 2 }}>
                      Raw Warning: “Consuming raw or undercooked meats, poultry,
                      seafood, shellfish, or eggs may increase your risk of
                      foodborne illness.”
                    </RawWarningMenuItemText>
                    <Spacer size="large" />
                  </>
                )}
              </>
            )}
            {props.route.params.item.firstOptionName &&
              props.route.params.item.firstOptions && (
                <>
                  <Divider />
                  <Spacer size="large" />
                  <MenuItemContainerName>
                    <MenuItemText>
                      Choose: {props.route.params.item.firstOptionName}
                    </MenuItemText>
                    {props.route.params.item.firstOptionRequired && (
                      <View style={{ justifyContent: "center" }}>
                        <SelectionRequiredText>
                          *Selection Required
                        </SelectionRequiredText>
                      </View>
                    )}
                  </MenuItemContainerName>

                  <RadioButton.Group>
                    {props.route.params.item.firstOptions.map((r, key) => (
                      <>
                        {parseFloat(r.price) === 0 || !r.price ? (
                          <>
                            <RadioButton.Item
                              key={key}
                              label={`${r.name}`}
                              onPress={() => {
                                setFirstOption(r.price, r.name);
                              }}
                              status={
                                firstOptionChoice.includes(r.name)
                                  ? "checked"
                                  : "unchecked"
                              }
                              value={r.name}
                              color="black"
                            />
                          </>
                        ) : (
                          <>
                            <RadioButton.Item
                              key={key}
                              label={`${r.name}   +$${r.price}`}
                              onPress={() => {
                                setFirstOption(r.price, r.name);
                              }}
                              status={
                                firstOptionChoice.includes(r.name)
                                  ? "checked"
                                  : "unchecked"
                              }
                              value={r.price}
                              color="black"
                            />
                          </>
                        )}
                      </>
                    ))}
                  </RadioButton.Group>
                </>
              )}
            {props.route.params.item.secondOptionName &&
              props.route.params.item.secondOptions && (
                <>
                  <Divider />
                  <Spacer size="large" />
                  <MenuItemContainerName>
                    <MenuItemText>
                      Choose: {props.route.params.item.secondOptionName}
                    </MenuItemText>
                    {props.route.params.item.secondOptionRequired && (
                      <View style={{ justifyContent: "center" }}>
                        <SelectionRequiredText>
                          *Selection Required
                        </SelectionRequiredText>
                      </View>
                    )}
                  </MenuItemContainerName>
                  <RadioButton.Group>
                    {props.route.params.item.secondOptions.map((r, key) => (
                      <>
                        {parseFloat(r.price) === 0 || !r.price ? (
                          <>
                            <RadioButton.Item
                              key={key}
                              label={`${r.name}`}
                              onPress={() => {
                                setSecondOption(r.price, r.name);
                              }}
                              status={
                                secondOptionChoice.includes(r.name)
                                  ? "checked"
                                  : "unchecked"
                              }
                              value={r.name}
                              color="black"
                            />
                          </>
                        ) : (
                          <>
                            <RadioButton.Item
                              key={key}
                              label={`${r.name}   +$${r.price}`}
                              onPress={() => {
                                setSecondOption(r.price, r.name);
                              }}
                              status={
                                secondOptionChoice.includes(r.name)
                                  ? "checked"
                                  : "unchecked"
                              }
                              value={r.price}
                              color="black"
                            />
                          </>
                        )}
                      </>
                    ))}
                  </RadioButton.Group>
                </>
              )}
            {props.route.params.item.sides[0] && (
              <>
                <Divider />
                <Spacer size="large" />
                <MenuItemContainerName>
                  <MenuItemText>Choose: side item</MenuItemText>
                  {props.route.params.item.sidesRequired && (
                    <View style={{ justifyContent: "center" }}>
                      <SelectionRequiredText>
                        *Selection Required
                      </SelectionRequiredText>
                    </View>
                  )}
                </MenuItemContainerName>
                <RadioButton.Group>
                  {props.route.params.item.sides.map((r, key) => (
                    <>
                      {parseFloat(r.price) === 0 || !r.price ? (
                        <>
                          <RadioButton.Item
                            key={key}
                            label={`${r.name}`}
                            onPress={() => {
                              setSideOption(r.price, r.name);
                            }}
                            status={
                              sideChoice === r.name ? "checked" : "unchecked"
                            }
                            value={r.name}
                            d
                            color="black"
                          />
                        </>
                      ) : (
                        <>
                          <RadioButton.Item
                            key={key}
                            label={`${r.name}  +$${r.price}`}
                            onPress={() => {
                              setSideOption(r.price, r.name);
                            }}
                            status={
                              sideChoice === r.name ? "checked" : "unchecked"
                            }
                            value={r.price}
                            d
                            color="black"
                          />
                        </>
                      )}
                    </>
                  ))}
                </RadioButton.Group>
              </>
            )}
          </MenuItemContainer>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <NumericInput
              value={quantity}
              onChange={(value) => setQuantity(value)}
              onLimitReached={(isMax, msg) => null}
              totalWidth={150}
              totalHeight={50}
              iconSize={25}
              step={1}
              valueType="real"
              rounded
              textColor="#BF1F2E"
              iconStyle={{ color: "white" }}
              rightButtonBackgroundColor="#BF1F2E"
              leftButtonBackgroundColor="#BF1F2E"
            />
          </View>
          <Spacer position="bottom" size="large">
            <Spacer position="bottom" size="large" />
            <OrderButton
              style={{ bottom: 0 }}
              mode="contained"
              onPress={() => {
                finishItem();
              }}
            >
              Add To Cart
            </OrderButton>
          </Spacer>
        </CartFullContainer>
      </ScrollView>
    </>
  );
};
