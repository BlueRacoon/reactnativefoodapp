/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect } from "react";
import { db } from "../../../../App";
import {
  arrayUnion,
  collection,
  doc,
  DocumentReference,
  FieldPath,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import theme from "../../../infrastructure/theme/index";

import {
  AccountBackground,
  AccountContainer,
  AccountCover,
  AdminButton,
  AdminContainer,
  AuthButton,
  AuthInput,
  Title,
  AdminModifyButton,
  DropDownContainer,
  RadioInput,
  RestModifyButton,
  OptionInput,
  CreateButton,
} from "../../../features/account/components/account.styles";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, KeyboardAvoidingView, View } from "react-native";

import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component";

import DropDownPicker from "react-native-dropdown-picker";
import { SwitchButtonContainer } from "../../restaurants/components/restaurant-info-card.styles";
import { RadioButton, Switch } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RestaurantMenuInfoCard } from "../components/restaurant-menu-info-card.component";
import { CategoryMenuInfoCard } from "../components/restaurant-category-info-card.component";
import { MenuItemInfoCard } from "../components/restaurant-item-info-card.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartPaymentProcessing } from "../../cart/components/cart.styles";
import { colors } from "../../../infrastructure/theme/colors";
import { useIsFocused } from "@react-navigation/native";
// import { useFocusEffect } from "@react-navigation/native";

// CRUD FUNCTIONS

export const MenuScreen = ({ navigation }) => {
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const { userEmail, user } = useContext(AuthenticationContext);
  const [currentlyLoading, setCurrentlyLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    // console.log("triggered");
    if (valueCategoryItem) {
      setCategory(valueCategoryItem);
      categoriesFunction();
      menuItemsFunction(valueCategoryItem);
    }
  }, [isFocused]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getDataForMenu();
  //     console.log("trigs");
  //   }, [])
  // );

  const loadCurrentRestaurant = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(
        `@currentRestaurant-${user.uid}`
      );

      if (value !== null) {
        setCurrentRestaurant(JSON.parse(value));
        // console.log(currentRestaurant);
      }
    } catch (e) {
      // console.log("error loading favorites from local", e);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      loadCurrentRestaurant(user.uid);
    }
  }, [user]);

  // manage change for menu items

  const handleChange = () => {
    console.log("change happened");
  };

  //MANAGE ADD MENU ITEM

  const [addMenuItemButtonDisabled, setAddMenuItemButtonDisabled] =
    useState(false);

  const Create = async () => {
    setAddMenuItemButtonDisabled(true);
    setCurrentlyLoading(true);
    //enable firebase in console before creating objects
    const docRef = doc(db, "restaurants", currentRestaurant);

    //data goes here

    const addedMenuItemToCategory = {
      name: name,
      price: parseFloat(price),
      desc: desc,
      isAvailable: true,
      isShowing: true,
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

    if (!valueMenusItem) {
      setCurrentlyLoading(false);
      setAddMenuItemButtonDisabled(false);
      return alert("Please select menu again");
    }

    if (!valueCategoryItem) {
      setCurrentlyLoading(false);
      setAddMenuItemButtonDisabled(false);
      return alert("Please re-choose category");
    }

    if (!name | !price) {
      setCurrentlyLoading(false);
      setAddMenuItemButtonDisabled(false);
      return alert("Please fill in all fields");
    }

    let itemVar = addedMenuItemToCategory.name;

    checkMenuItems(
      itemVar,
      localData.menus[valueMenusItem][valueCategoryItem]
    ).then((result) => {
      if (result === false) {
        try {
          setDoc(
            docRef,
            {
              menus: {
                [valueMenusItem]: {
                  [valueCategoryItem]: arrayUnion(addedMenuItemToCategory),
                },
              },
            },
            { merge: true }
          ).then(() => {
            setCurrentlyLoading(false);
            setAddMenuItemButtonDisabled(false);
            Alert.alert("Menu item created!");
          });
        } catch (e) {
          setCurrentlyLoading(false);
          setAddMenuItemButtonDisabled(false);
          Alert.alert("Issue creating menu!");
        }
      } else {
        setCurrentlyLoading(false);
        setAddMenuItemButtonDisabled(false);
        Alert.alert("Menu Item name already in use!");
        return;
      }
    });
  };

  // MANAGE ADD CATEGORY

  const [addCategoryButtonDisabled, setAddCategoryButtonDisabled] =
    useState(false);

  const addCategory = () => {
    setAddCategoryButtonDisabled(true);
    setCurrentlyLoading(true);

    let tempCat = categoryName.toLowerCase();

    const addedCategory = {
      [tempCat]: [],
    };

    const addCategoryObjectToProperties = {
      name: tempCat,
      isShowing: true,
    };

    if (!categoryName | !valueMenusItem | !tempCat) {
      setCurrentlyLoading(false);
      setAddCategoryButtonDisabled(false);
      return alert("Please fill in all fields");
    }

    let catVar = { name: `${tempCat}` };

    checkCats(catVar, localData.menus[valueMenusItem].properties).then(
      (result) => {
        // console.log(result);
        const docRef = doc(db, "restaurants", currentRestaurant);

        if (result === false) {
          try {
            setDoc(
              docRef,
              {
                menus: {
                  [valueMenusItem]: addedCategory,
                },
              },
              { merge: true }
            ).then(() => {
              setDoc(
                docRef,
                {
                  menus: {
                    [valueMenusItem]: {
                      properties: arrayUnion(addCategoryObjectToProperties),
                    },
                  },
                },
                { merge: true }
              ).then(() => {
                setCurrentlyLoading(false);
                setAddCategoryButtonDisabled(false);
                Alert.alert("Category created!");
              });
            });
          } catch (e) {
            setCurrentlyLoading(false);
            setAddCategoryButtonDisabled(false);
            Alert.alert("Issues creating category. Please try again!");
          }
        } else {
          setCurrentlyLoading(false);
          setAddCategoryButtonDisabled(false);
          Alert.alert("Category already in use!");
          return;
        }
      }
    );
  };

  //MANAGE ADD MENU

  const [addMenuButtonDisabled, setAddMenuButtonDisabled] = useState(false);

  const addMenu = async () => {
    setAddMenuButtonDisabled(true);
    setCurrentlyLoading(true);
    if (!createMenu) {
      setCurrentlyLoading(false);
      return alert("Please fill fields");
    }

    let result = menuList.includes(`${createMenu}`);

    if (!result) {
      const docRef = doc(db, "restaurants", currentRestaurant);
      try {
        setDoc(
          docRef,
          {
            menus: {
              [createMenu]: {},
            },
          },
          { merge: true }
        ).then(() => {
          setCurrentlyLoading(false);
          setAddMenuButtonDisabled(false);
          Alert.alert("Menu created!");
        });
      } catch (e) {
        setCurrentlyLoading(false);
        setAddMenuButtonDisabled(false);
        Alert.alert("Please try again.");
      }
    } else {
      setCurrentlyLoading(false);
      setAddMenuButtonDisabled(false);
      Alert.alert("Menu already in use!");
      return;
    }
  };

  const checkCats = (currentVal, data) => {
    return new Promise((resolve, reject) => {
      try {
        let result = data.some((x) => x.name === currentVal.name);

        if (!result) {
          resolve(false);
        } else {
          resolve(true);
        }
      } catch (e) {
        resolve(false);
      }
    });
  };

  const checkMenuItems = (currentVal, data) => {
    return new Promise((resolve, reject) => {
      try {
        let result = data.some((x) => x.name === currentVal);

        if (!result) {
          resolve(false);
        } else {
          resolve(true);
        }
      } catch (e) {
        resolve(false);
      }
    });
  };

  const checkMenus = (currentVal, data) => {
    return new Promise((resolve, reject) => {
      try {
        let result = data.some((x) => x.name === currentVal.name);
        // console.log(result);
        if (!result) {
          resolve(false);
        } else {
          resolve(true);
        }
      } catch (e) {
        resolve(false);
      }
    });
  };

  const clearMenu = () => {
    setDocName("failure");
    setName("");
    setDesc("");
    setPrice(0);
    setMenuItemOptionsName(null);
    setMoreMenuItemOptionsName(null);
    setMenuItemOption([]);
    setMoreMenuItemOption([]);
    setSideOptions([]);
    setShowMenuTemp(false);
    setShowMenuRawWarning(false);
    setIngredientOptions([]);
    setNutAllergy(false);
    setShellfishAllergy(false);
    setWheatAllergy(false);
    setFishAllergy(false);
    setSoyAllergy(false);
    setDiaryAllergy(false);
    setShowMenuOptions(false);
    setShowMenuMoreOptions(false);
    setShowMenuSides(false);
    setShowMenuAllergyWarning(false);
    setShowIngredients(false);
    alert("Cleared inputs!");
  };

  const clearCategory = () => {
    setCategoryName("");
    alert("Cleared inputs!");
  };

  const [menuList, setMenuList] = useState([]);
  const [localData, setLocalData] = useState({});
  const [getMenusItems, setGetMenusItems] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getMenuItems, setGetMenuItems] = useState([]);

  // store local data, set menus, and update if need be   ----- NEEEEEEEEED TO PASS IN RESTAURANT NAME HERE TO USE FOR THE USE EFFECT

  // const citiesRef = collection(db, "cities");

  // // Create a query against the collection.
  // const q = query(citiesRef, where("state", "==", "CA"));

  const getDataForMenu = () => {
    try {
      // console.log(currentRestaurant);
      onSnapshot(doc(db, "restaurants", currentRestaurant), (snapshot) => {
        let data = snapshot.data();
        setLocalData(data);

        // setMenuList([]);
        let tempMenuList = [];
        // setGetMenusItems([]);
        let tempGetMenuItems = [];
        let tempCount = 0;
        if (typeof data?.menus !== "undefined") {
          for (let [key] of Object.entries(data.menus)) {
            tempCount++;
            // console.log(`${key}`);
            tempMenuList.push(`${key}`);
            tempGetMenuItems.push({
              label: `${key}`,
              value: `${key}`,
            });

            // console.log("running...");
            // console.log(tempCount);
            // console.log(Object.entries(data.menus).length);
            if (tempCount === Object.entries(data.menus).length) {
              // console.log("completed");
              setMenuList(tempMenuList);
              setGetMenusItems(tempGetMenuItems);
            }
          }
        }
        // console.log(menuList);
        // console.log(getMenusItems);

        // console.log(data.menus);
        // data.menus.forEach((item) => setMenuList(menuList.push[item]));
      });
    } catch (e) {
      // alert("Issue pulling collection list");
      return;
    }
  };

  useEffect(() => {
    // onSnapshot(collection(db, "restaurants"), (snapshot) => {
    //   let data = snapshot;
    //   console.log(snapshot);
    // data.includes();
    const restRef = getDocs(collection(db, "restaurants"))
      .then((data) => {
        data.forEach((doc) => {
          // console.log(doc.data().email);
          if (doc.data().email === userEmail) {
            setCurrentRestaurant(doc.data().name);
            try {
              const jsonValue = JSON.stringify(doc.data().name);
              AsyncStorage.setItem(`@currentRestaurant-${user.uid}`, jsonValue);
            } catch (e) {
              // console.log("error storing accountType locally", e);
            }
          }
        });
      })
      .then(() => {
        getDataForMenu();
      });
  }, [userEmail, currentRestaurant, user.uid]);

  // store and update categories

  // useEffect(() => {
  //   setGetCategories([]);
  //   console.log(valueMenusItem);
  //   try {
  //     for (let [key] of Object.entries(localData.menus[valueMenusItem])) {
  //       console.log(`${key}`);
  //       setGetCategories((oldArray2) => [
  //         ...oldArray2,
  //         {
  //           label: `${key}`,
  //           value: `${key}`,
  //         },
  //       ]);
  //     }
  //     console.log(getCategories);
  //   } catch (e) {
  //     alert("Issue setting categories list");
  //     return;
  //   }
  // }, [valueMenusItem, localData, setValueMenusItem, setGetCategories]);

  const categoriesFunction = (menu) => {
    // setGetCategories([]);
    !menu ? (menu = valueMenusItem) : null;

    let tempArr = [];
    let count = 0;

    let end = Object.entries(localData.menus[menu]).length;

    if (end === 0) {
      setGetCategories(tempArr);
    } else {
      try {
        for (let [key] of Object.entries(localData.menus[menu])) {
          // console.log(`${key}`);
          count++;
          if (`${key}` !== "properties") {
            // setGetCategories((oldArray2) => [
            //   ...oldArray2,
            tempArr.push({
              label: `${key}`,
              value: `${key}`,
            });
            if (count === end) {
              setGetCategories(tempArr);
            }
          }
          if (count === end) {
            setGetCategories(tempArr);
          }
        }
      } catch (e) {
        alert("Please click pick menu after menu selection.");
        return;
      }
    }
  };

  const menuItemsFunction = (cat) => {
    let tempArr = [];
    let count = 0;
    const tempPath = localData.menus[valueMenusItem];
    // console.log("TP", tempPath[cat]);
    try {
      if (tempPath[cat].length > 0) {
        tempPath[cat].map((r, k) => {
          count++;
          tempArr.push(r);
          if ((count = tempPath[cat].length)) {
            setGetMenuItems(tempArr);
            return;
          }
        });
      } else {
        setGetMenuItems(tempArr);
      }
    } catch (e) {
      setGetMenuItems(tempArr);
      // alert("Please click pick menu after menu selection.");
      return;
    }
  };

  // READ IN CITIES FROM COLLECTION

  // useEffect(() => {
  //   try {
  //     onSnapshot(collection(db, "categories"), (snapshot) => {
  //       setCategoryList(snapshot.docs.map((doc) => doc.data()));
  //       setCategoryList(snapshot.docs.map((doc) => doc.data()));
  //     });
  //   } catch (e) {
  //     alert("Issue pulling collection list");
  //     return;
  //   }
  // }, [categoryList, modifyCategoryScreen]);

  //VARIABLES

  const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
  const [docName, setDocName] = useState("failure");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [monHours, setMonHours] = useState("");
  const [tuesHours, setTuesHours] = useState("");
  const [wedHours, setWedHours] = useState("");
  const [thursHours, setThursHours] = useState("");
  const [friHours, setFriHours] = useState("");
  const [satHours, setSatHours] = useState("");
  const [sunHours, setSunHours] = useState("");
  const [desc, setDesc] = useState("");
  const [menu, setMenu] = useState("");
  const [category, setCategory] = useState("");

  // required stuff

  const [moreMenuItemOptionRequired, setMoreMenuItemOptionRequired] =
    useState(false);
  const [menuItemOptionRequired, setMenuItemOptionRequired] = useState(false);
  const [sidesRequired, setSidesRequired] = useState(false);
  const [tempSelectionRequired, setTempSelectionRequired] = useState(false);

  const [moreMenuItemOptionMultiple, setMoreMenuItemOptionMultiple] =
    useState(false);
  const [menuItemOptionMultiple, setMenuItemOptionMultiple] = useState(false);

  // MENU OPTIONS STUFF

  const [menuItemOptionsName, setMenuItemOptionsName] = useState(null);
  const [menuInputOptionName, setMenuInputOptionName] = useState(false);
  const [menuInputOptionPrice, setMenuInputOptionPrice] = useState(0);
  const [menuItemOptionsNameToggle, setMenuItemOptionsNameToggle] =
    useState(false);
  const [menuItemOption, setMenuItemOption] = useState([]);

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

  const deleteMenuItem = (target) => {
    setMenuItemOption(menuItemOption.filter((v) => v.name !== target.name));
  };

  // MORE MENU OPTION ADDITIONS

  const [moreMenuInputOptionName, setMoreMenuInputOptionName] = useState(false);
  const [moreMenuInputOptionPrice, setMoreMenuInputOptionPrice] = useState(0);
  const [moreMenuItemOptionsName, setMoreMenuItemOptionsName] = useState(null);
  const [moreMenuItemOptionsNameToggle, setMoreMenuItemOptionsNameToggle] =
    useState(false);
  const [moreMenuItemOption, setMoreMenuItemOption] = useState([]);

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

  const deleteMoreMenuItem = (target) => {
    setMoreMenuItemOption(
      moreMenuItemOption.filter((v) => v.name !== target.name)
    );
  };

  // SETTING UP SIDE VARIABLES

  const [sideOptionName, setSideOptionName] = useState(null);
  const [sideOptionPrice, setSideOptionPrice] = useState(0);
  const [sideOptions, setSideOptions] = useState([]);

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

  const deleteSideOption = (target) => {
    setSideOptions(sideOptions.filter((v) => v.name !== target.name));
  };

  // SETTING UP INGREDIENTS VARIABLES

  const [ingredientOption, setIngredientOption] = useState(null);
  const [ingredientOptions, setIngredientOptions] = useState([]);

  const addIngredientOption = () => {
    setIngredientOptions((oldArray) => [
      ...oldArray,
      {
        name: ingredientOption,
      },
    ]);

    setIngredientOption("");
  };

  const deleteIngredientOption = (target) => {
    setIngredientOptions(
      ingredientOptions.filter((v) => v.name !== target.name)
    );
  };

  //SCREENS
  const [modifyScreen, setModifyScreen] = useState(false);
  const [categoryScreen, setCategoryScreen] = useState(true);
  const [modifyMenuScreen, setModifyMenuScreen] = useState(true);
  const [modifyCategoryScreen, setModifyCategoryScreen] = useState(false);
  const [modifyItemsScreen, setModifyItemsScreen] = useState(false);

  //USEEFFECT LISTS
  const [loading, setLoading] = useState(false);

  //Category VARIABLES

  const [categoryName, setCategoryName] = useState("");
  const [createMenu, setCreateMenu] = useState("");
  const [addCategoryScreen, setAddCategoryScreen] = useState(true);
  const [addMenuScreen, setAddMenuScreen] = useState(false);
  const [itemMenuScreen, setItemMenuScreen] = useState(false);

  // switches for menu item

  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [showMenuMoreOptions, setShowMenuMoreOptions] = useState(false);
  const [showMenuSides, setShowMenuSides] = useState(false);
  const [showMenuTemp, setShowMenuTemp] = useState(false);
  const [showMenuRawWarning, setShowMenuRawWarning] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showMenuAllergyWarning, setShowMenuAllergyWarning] = useState(false);

  // ALLERGY VARIABLES

  const [nutAllergy, setNutAllergy] = useState(false);
  const [shellfishAllergy, setShellfishAllergy] = useState(false);
  const [fishAllergy, setFishAllergy] = useState(false);
  const [diaryAllergy, setDiaryAllergy] = useState(false);
  const [soyAllergy, setSoyAllergy] = useState(false);
  const [eggAllergy, setEggAllergy] = useState(false);
  const [wheatAllergy, setWheatAllergy] = useState(false);

  // ADD MENU/CAT DROP DOWNS

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  // ADD MENU ITEM DROPDOWNS

  const [openMenusItem, setOpenMenusItem] = useState(false);
  const [valueMenusItem, setValueMenusItem] = useState(null);

  // ADD CAT ITEM DROPDOWNS

  const [openCategoryItem, setOpenCategoryItem] = useState(false);
  const [valueCategoryItem, setValueCategoryItem] = useState(null);

  const hours = {
    mon: monHours,
    tues: tuesHours,
    wed: wedHours,
    thurs: thursHours,
    fri: friHours,
    sat: satHours,
    sun: sunHours,
  };

  // HANDLES Alert POPUP

  const twoButtonAlert = (func, option) => {
    let response = false;
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

  const clearButtonAlert = (func, option) => {
    let response = false;
    Alert.alert("Action", "Are you sure you want to clear this item?", [
      {
        text: "No",
        onPress: () => {
          return;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          clearMenu();
          return;
        },
      },
    ]);
  };

  const handleMenuChange = (target) => {
    setMenu(target);
  };

  const [catProps, setCatProps] = useState({});

  useEffect(() => {
    if (valueMenusItem) {
      setCatProps({});
      setCatProps(localData.menus[valueMenusItem]);
      // console.log(catProps.properties);
    }
  }, [localData, valueMenusItem]);

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
          <Spacer size="xl" />
          <Spacer size="large" />
          <ScrollView>
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
            <AccountCover />

            <Spacer size="large" />
            <AdminContainer>
              <CreateButton
                mode="contained"
                onPress={async () => {
                  setModifyScreen(false), setCategoryScreen(true);
                }}
              >
                Create
              </CreateButton>
              <CreateButton
                mode="contained"
                onPress={async () => {
                  setModifyScreen(true), setCategoryScreen(false);
                }}
              >
                Manage
              </CreateButton>
            </AdminContainer>

            {modifyScreen && (
              <>
                <Spacer size="large" />
                <Title>Modify Screen</Title>
                <Spacer size="large" />
                <AdminContainer>
                  <RestModifyButton
                    mode="contained"
                    onPress={async () => {
                      setModifyCategoryScreen(false),
                        setModifyMenuScreen(true),
                        setModifyItemsScreen(false);
                    }}
                  >
                    Menu
                  </RestModifyButton>
                  <RestModifyButton
                    mode="contained"
                    onPress={async () => {
                      setModifyCategoryScreen(true),
                        setModifyMenuScreen(false),
                        setModifyItemsScreen(false);
                    }}
                  >
                    Cats
                  </RestModifyButton>
                  <RestModifyButton
                    mode="contained"
                    onPress={async () => {
                      setModifyCategoryScreen(false),
                        setModifyMenuScreen(false),
                        setModifyItemsScreen(true);
                    }}
                  >
                    Items
                  </RestModifyButton>
                </AdminContainer>
                {modifyMenuScreen && (
                  <>
                    <Spacer size="large" />
                    <Title>Manage Menus</Title>

                    <AccountContainer>
                      <Text variant="label">Your current menus</Text>
                      {localData.menus === [] && (
                        <>
                          <Text>No menus</Text>
                        </>
                      )}
                      {localData.menus && (
                        <>
                          {Object.keys(localData.menus).map((r, k) => (
                            <>
                              <Spacer size="large" k={`${k}-k`}>
                                <RestaurantMenuInfoCard
                                  name={r}
                                  index={`${k}-k`}
                                  rest={currentRestaurant}
                                />
                              </Spacer>
                            </>
                          ))}
                        </>
                      )}
                    </AccountContainer>
                  </>
                )}
                {modifyCategoryScreen && (
                  <>
                    <Spacer size="large" />
                    <Title>Manage Categories</Title>
                    <AccountContainer
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {localData.menus && (
                        <>
                          <Text variant="label">
                            Choose a menu to edit it's categories
                          </Text>
                          <DropDownContainer zIndex={2000}>
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
                                open={openMenusItem}
                                value={valueMenusItem}
                                items={getMenusItems}
                                setOpen={setOpenMenusItem}
                                setValue={setValueMenusItem}
                                setItems={setGetMenusItems}
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
                                onSelectItem={(item) => {
                                  // console.log(item);
                                  categoriesFunction(item.label),
                                    setMenu(item.label);
                                }}
                              />
                            </Spacer>
                          </DropDownContainer>

                          <Spacer size="large" />
                          {getCategories.length > 0 && (
                            <>
                              {getCategories.map((r, k) => (
                                <View style={{ width: "100%" }}>
                                  <Spacer size="large" k={`${k}-k`}>
                                    <CategoryMenuInfoCard
                                      {...r}
                                      properties={catProps.properties}
                                      menuUsed={valueMenusItem}
                                      key={`${k}-k`}
                                      rest={currentRestaurant}
                                    />
                                  </Spacer>
                                </View>
                              ))}
                            </>
                          )}
                          {getCategories.length === 0 && (
                            <>
                              <Text>No categories!</Text>
                            </>
                          )}
                        </>
                      )}
                    </AccountContainer>
                  </>
                )}
                {modifyItemsScreen && (
                  <>
                    <Spacer size="large" />
                    <Title>Manage Menu Items</Title>
                    <AccountContainer
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {localData.menus && (
                        <>
                          <Text variant="label">Choose a menu</Text>
                          <DropDownContainer zIndex={2000}>
                            <Spacer size="large">
                              <DropDownPicker
                                style={{
                                  borderColor: "#E7E7E7",
                                  color: "green",
                                  backgroundColor: "#E7E7E7",
                                  borderRadius: 5,
                                  height: 61,
                                  zIndex: 999,
                                }}
                                placeholder="Select A Menu"
                                open={openMenusItem}
                                value={valueMenusItem}
                                items={getMenusItems}
                                setOpen={setOpenMenusItem}
                                setValue={setValueMenusItem}
                                setItems={setGetMenusItems}
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
                                onSelectItem={(item) => {
                                  categoriesFunction(item.label),
                                    setMenu(valueMenusItem);
                                  setGetMenuItems([]);
                                }}
                              />
                            </Spacer>
                          </DropDownContainer>

                          <Spacer size="large" />
                          <Text variant="label">Choose a category</Text>
                          <DropDownContainer zIndex={1000}>
                            <Spacer size="large">
                              <DropDownPicker
                                style={{
                                  borderColor: "#E7E7E7",
                                  color: "green",
                                  backgroundColor: "#E7E7E7",
                                  borderRadius: 5,
                                  height: 61,
                                }}
                                placeholder="Select A Category"
                                open={openCategoryItem}
                                value={valueCategoryItem}
                                items={getCategories}
                                setOpen={setOpenCategoryItem}
                                setValue={setValueCategoryItem}
                                setItems={setGetCategories}
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
                                onSelectItem={(item) => {
                                  // console.log(item);
                                  setCategory(valueCategoryItem),
                                    menuItemsFunction(item.label);
                                }}
                              />
                            </Spacer>
                          </DropDownContainer>

                          <Spacer size="large">
                            <Text variant="label" style={{ width: "90%" }}>
                              Editing {valueCategoryItem} from the{" "}
                              {valueMenusItem} menu below
                            </Text>
                          </Spacer>
                          <Spacer size="large" />
                          <AdminButton
                            mode="contained"
                            style={{ width: 150 }}
                            onPress={() => {
                              setCategory(valueCategoryItem),
                                categoriesFunction(),
                                menuItemsFunction(valueCategoryItem);
                            }}
                          >
                            Refresh
                          </AdminButton>

                          <Spacer size="large" />
                          <>
                            {!getMenuItems[0] && (
                              <View>
                                <Spacer size="large">
                                  <Text variant="hint">
                                    No Menu items for this category.
                                  </Text>
                                </Spacer>
                              </View>
                            )}
                            {getMenuItems.map((r, k) => (
                              <View style={{ width: "100%" }}>
                                <Spacer
                                  size="large"
                                  position="top"
                                  k={`${k}-k`}
                                >
                                  <MenuItemInfoCard
                                    {...r}
                                    catUsed={valueCategoryItem}
                                    menuUsed={valueMenusItem}
                                    key={`${k}-k`}
                                    rest={currentRestaurant}
                                    navigation={navigation}
                                  />
                                </Spacer>
                              </View>
                            ))}
                          </>
                        </>
                      )}
                    </AccountContainer>
                  </>
                )}
              </>
            )}

            {categoryScreen && (
              <>
                <Spacer size="large" />
                <Title>Create Screen</Title>
                <Spacer size="large" />
                <AdminContainer>
                  <AdminModifyButton
                    mode="contained"
                    onPress={async () => {
                      setAddCategoryScreen(false),
                        setAddMenuScreen(true),
                        setItemMenuScreen(false);
                    }}
                  >
                    Menu
                  </AdminModifyButton>
                  <AdminModifyButton
                    mode="contained"
                    onPress={async () => {
                      setAddCategoryScreen(true),
                        setAddMenuScreen(false),
                        setItemMenuScreen(false);
                    }}
                  >
                    Cats
                  </AdminModifyButton>
                  <AdminModifyButton
                    mode="contained"
                    onPress={async () => {
                      setAddCategoryScreen(false), setAddMenuScreen(false);
                      setItemMenuScreen(true);
                    }}
                  >
                    Items
                  </AdminModifyButton>
                </AdminContainer>
                {itemMenuScreen && (
                  <>
                    <Spacer size="large" />
                    {loading && <Text>Loading...</Text>}
                    <Title>Enter New Menu Item</Title>
                    <AccountContainer>
                      <DropDownContainer zIndex={2000}>
                        <Spacer size="large">
                          <DropDownPicker
                            style={{
                              borderColor: "#E7E7E7",
                              color: "green",
                              backgroundColor: "#E7E7E7",
                              borderRadius: 5,
                              height: 61,
                              zIndex: 999,
                            }}
                            placeholder="Select A Menu"
                            open={openMenusItem}
                            value={valueMenusItem}
                            items={getMenusItems}
                            setOpen={setOpenMenusItem}
                            setValue={setValueMenusItem}
                            setItems={setGetMenusItems}
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
                            onSelectItem={(item) => {
                              categoriesFunction(item.label),
                                setMenu(valueMenusItem);
                            }}
                          />
                        </Spacer>
                      </DropDownContainer>
                      <DropDownContainer zIndex={1000}>
                        <Spacer size="large">
                          <DropDownPicker
                            style={{
                              borderColor: "#E7E7E7",
                              color: "green",
                              backgroundColor: "#E7E7E7",
                              borderRadius: 5,
                              height: 61,
                            }}
                            placeholder="Select A Category"
                            open={openCategoryItem}
                            value={valueCategoryItem}
                            items={getCategories}
                            setOpen={setOpenCategoryItem}
                            setValue={setValueCategoryItem}
                            setItems={setGetCategories}
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
                              setCategory(valueCategoryItem);
                            }}
                          />
                        </Spacer>
                      </DropDownContainer>
                      <Spacer size="large">
                        <AuthInput
                          label="Name"
                          value={name}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(n) => {
                            setName(n), setDocName(n);
                          }}
                        />
                      </Spacer>
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

                      <SwitchButtonContainer>
                        <Spacer size="large" />
                        <Text>
                          Add Menu Item Options (Example: select size)
                        </Text>
                        <Switch
                          onChange={() => (
                            setShowMenuOptions(!showMenuOptions),
                            setMenuItemOptionsNameToggle(
                              !menuItemOptionsNameToggle
                            ),
                            !showMenuOptions && setMenuItemOption([]),
                            !showMenuOptions && setMenuItemOptionsName(null),
                            !showMenuOptions &&
                              setMenuItemOptionRequired(false),
                            !showMenuOptions && setMenuItemOptionMultiple(false)
                          )}
                          value={showMenuOptions}
                        />
                      </SwitchButtonContainer>

                      {showMenuOptions && (
                        <>
                          <Spacer size="large" />
                          <RadioButton.Group>
                            <RadioButton.Item
                              label="Make selection required?"
                              onPress={() =>
                                setMenuItemOptionRequired(
                                  !menuItemOptionRequired
                                )
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
                                setMenuItemOptionMultiple(
                                  !menuItemOptionMultiple
                                )
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
                            onChangeText={(mion) =>
                              setMenuItemOptionsName(mion)
                            }
                          />
                        </>
                      )}

                      {menuItemOptionsNameToggle && showMenuOptions && (
                        <>
                          <Spacer size="large">
                            <OptionInput
                              label="Option Name (Ex: Pepperoni)"
                              value={menuInputOptionName}
                              keyboardType="default"
                              autoCapitalize="none"
                              onChangeText={(op) => setMenuInputOptionName(op)}
                            />
                          </Spacer>
                          <Spacer size="large">
                            <OptionInput
                              label="Option Price (Ex: 3.99)"
                              value={menuInputOptionPrice}
                              keyboardType="default"
                              autoCapitalize="none"
                              onChangeText={(opp) =>
                                setMenuInputOptionPrice(opp)
                              }
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
                                              backgroundColor:
                                                colors.brand.primary,
                                              borderRadius: 10,
                                              padding: 4,
                                              justifyContent: "center",
                                            }}
                                            onPress={() => {
                                              twoButtonAlert(
                                                deleteMenuItem,
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
                      <SwitchButtonContainer>
                        <Spacer size="large" />
                        <Text>
                          Add More Item Options (Example: select size)
                        </Text>
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

                      {showMenuMoreOptions && (
                        <>
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
                                moreMenuItemOptionRequired
                                  ? "checked"
                                  : "unchecked"
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
                                moreMenuItemOptionMultiple
                                  ? "checked"
                                  : "unchecked"
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
                        </>
                      )}

                      {showMenuMoreOptions && moreMenuItemOptionsNameToggle && (
                        <>
                          <Spacer size="large">
                            <OptionInput
                              label="Option Name (Ex: Pepperoni)"
                              value={moreMenuInputOptionName}
                              keyboardType="default"
                              autoCapitalize="none"
                              onChangeText={(op) =>
                                setMoreMenuInputOptionName(op)
                              }
                            />
                          </Spacer>
                          <Spacer size="large">
                            <OptionInput
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
                                              backgroundColor:
                                                colors.brand.primary,
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

                      <SwitchButtonContainer>
                        <Spacer size="large" />
                        <Text>Add Sides</Text>
                        <Switch
                          onChange={() => {
                            setShowMenuSides(!showMenuSides),
                              !showMenuSides && setSideOptions([]),
                              setSidesRequired(false);
                          }}
                          value={showMenuSides}
                        />
                      </SwitchButtonContainer>
                      {showMenuSides && (
                        <>
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
                            <OptionInput
                              label="Side Name (Ex: Fries)"
                              value={sideOptionName}
                              keyboardType="default"
                              autoCapitalize="none"
                              onChangeText={(son) => setSideOptionName(son)}
                            />
                          </Spacer>
                          <Spacer size="large">
                            <OptionInput
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
                                      <Spacer
                                        key={key}
                                        position="left"
                                        size="medium"
                                      >
                                        <TouchableOpacity
                                          style={{
                                            backgroundColor:
                                              colors.brand.primary,
                                            borderRadius: 10,
                                            padding: 4,
                                            justifyContent: "center",
                                          }}
                                          onPress={() => {
                                            twoButtonAlert(
                                              deleteSideOption,
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
                      {showMenuTemp && (
                        <>
                          <Spacer size="large">
                            <RadioButton.Group>
                              <RadioButton.Item
                                label="Make selection required?"
                                onPress={() =>
                                  setTempSelectionRequired(
                                    !tempSelectionRequired
                                  )
                                }
                                status={
                                  tempSelectionRequired
                                    ? "checked"
                                    : "unchecked"
                                }
                                value={tempSelectionRequired}
                                color="black"
                              />
                            </RadioButton.Group>
                            <Spacer size="small" />
                            <Text>
                              *Tempature selction will show up for this menu
                              item on the user end. If no selection is made,
                              assume Medium as default*
                            </Text>
                          </Spacer>
                        </>
                      )}
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
                      {showMenuRawWarning && (
                        <>
                          <Spacer size="large">
                            <Text>
                              *Raw warning will show up for this menu item on
                              the user end*
                            </Text>
                          </Spacer>
                        </>
                      )}
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
                      {showMenuAllergyWarning && (
                        <>
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
                              onPress={() =>
                                setShellfishAllergy(!shellfishAllergy)
                              }
                              status={
                                shellfishAllergy ? "checked" : "unchecked"
                              }
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
                        </>
                      )}
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
                      {showIngredients && (
                        <>
                          <Spacer size="large">
                            <OptionInput
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
                                      <Spacer
                                        key={key}
                                        position="left"
                                        size="medium"
                                      >
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
                        <AuthButton
                          mode="contained"
                          disabled={addMenuItemButtonDisabled}
                          onPress={Create}
                        >
                          Add Menu Item
                        </AuthButton>
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton mode="contained" onPress={clearButtonAlert}>
                          Clear
                        </AuthButton>
                      </Spacer>
                    </AccountContainer>
                  </>
                )}

                {addCategoryScreen && (
                  <>
                    <Spacer size="large" />

                    <Title>Add Category To A Menu</Title>
                    <AccountContainer
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <DropDownContainer zIndex={1000}>
                        <Spacer size="large">
                          <DropDownPicker
                            style={{
                              borderColor: "#E7E7E7",
                              color: "green",
                              backgroundColor: "#E7E7E7",
                              borderRadius: 5,
                              height: 61,
                              // fontFamily: "Oswald_400Regular",
                            }}
                            inputIOS={{
                              color: "white",
                              fontSize: 35,
                            }}
                            placeholder="Select A Menu"
                            open={openMenusItem}
                            value={valueMenusItem}
                            items={getMenusItems}
                            setOpen={setOpenMenusItem}
                            setValue={setValueMenusItem}
                            setItems={setGetMenusItems}
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
                            onSelectItem={(item) => {
                              // console.log(item);
                            }}
                          />
                        </Spacer>
                      </DropDownContainer>

                      <Spacer size="large">
                        <AuthInput
                          label="Category name"
                          value={categoryName}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(n) => setCategoryName(n)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          disabled={addCategoryButtonDisabled}
                          onPress={addCategory}
                        >
                          Add Category
                        </AuthButton>
                      </Spacer>
                    </AccountContainer>
                  </>
                )}
                {addMenuScreen && (
                  <>
                    <Spacer size="large">
                      <Title>Create A Menu</Title>
                    </Spacer>
                    <AccountContainer
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Spacer size="large">
                        <AuthInput
                          label="Menu name"
                          value={createMenu}
                          keyboardType="default"
                          autoCapitalize="none"
                          onChangeText={(n) => setCreateMenu(n)}
                        />
                      </Spacer>
                      <Spacer size="large">
                        <AuthButton
                          mode="contained"
                          disabled={addMenuButtonDisabled}
                          onPress={addMenu}
                        >
                          Create Menu
                        </AuthButton>
                      </Spacer>
                    </AccountContainer>
                  </>
                )}
              </>
            )}
            <Spacer size="xxl" />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AccountBackground>
  );
};
