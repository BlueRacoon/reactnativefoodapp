/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect } from "react";

import { db } from "../../../../App";
import {
  arrayUnion,
  collection,
  doc,
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

import {
  AccountBackground,
  AccountContainer,
  AccountCover,
  AdminButton,
  AdminContainer,
  AuthButton,
  AuthInput,
  Title,
  AdminCreateModifyButton,
} from "../../../features/account/components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAvoidingView, View, Image, Alert } from "react-native";
import { ImagePropTypes } from "deprecated-react-native-prop-types";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Text } from "../../../components/typography/text.component";
import { AdminStoreInfoCard } from "../components/admin-store-info-card.component";
import { AdminCityInfoCard } from "../components/admin-city-info-card.component";

import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../../../services/authentication/authentication.context";

// CRUD FUNCTIONS

export const CreateRestaurantScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  //CRUD functions
  const Create = () => {
    //enable firebase in console before creating objects
    const myDoc = doc(db, "restaurants", docName);
    const addToAuth = doc(db, "authenticate", "restaurants");
    var b = new Date();
    b.setMinutes(b.getMinutes() - b.getTimezoneOffset());
    let useDate = b.toISOString().slice(0, 10);

    //data goes here
    const addingRestaurant = {
      name: name,
      username: userName,
      city: city,
      zip: zip,
      state: state,
      password: password,
      desc: desc,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      hours,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      accountType: "restaurant",
      menus: {},
      isOpen: false,
      isShowing: false,
      createdAt: useDate,
      photo: photo,
      location: {
        lng: parseFloat(lng),
        lat: parseFloat(lat),
      },
      viewport: {
        northeast: {
          lat: parseFloat(`${(parseFloat(lat) - 0.005).toFixed(6)}`),
          lng: parseFloat(`${(parseFloat(lng) + 0.0156).toFixed(6)}`),
        },
        southwest: {
          lat: parseFloat(`${(parseFloat(lat) - 0.008).toFixed(6)}`),
          lng: parseFloat(`${(parseFloat(lng) + 0.012).toFixed(6)}`),
        },
      },
    };
    if (!name | !userName | !password | !email | !address | !desc | !city) {
      return alert("Please fill in all fields");
    }
    if (password.length < 7) {
      return alert("Please make password longer than 7 characters");
    }

    // ADDING IN CREATE ACCOUNT FOR RESTAURANT TO LOGIN

    createUserWithEmailAndPassword(getAuth(), email, password);

    // change image url
    // changeImage();

    setDoc(myDoc, addingRestaurant)
      // handingling promises
      .then(() => {
        alert("New restaurant created!");
      })
      .catch((error) => {
        alert("Error creating restaurant");
      });

    //add rest email to the auth array

    let lowerEmail = email.toLowerCase();
    updateDoc(addToAuth, { emails: arrayUnion(lowerEmail) }, { merge: true })
      // handingling promises
      .then(() => {
        alert("Auth updated");
      })
      .catch((error) => {
        alert("Error updating auth");
      });
  };

  const addCity = async () => {
    //enable firebase in console before creating objects
    const myCityDoc = doc(db, "cities", cityDocName);

    //data goes here
    const addingCity = {
      cityName: cityName,
      cityLat: parseFloat(cityLat),
      cityLng: parseFloat(cityLng),
      cityPhoto: cityPhoto,
      cityShowing: false,
      location: {
        lng: parseFloat(cityLng),
        lat: parseFloat(cityLat),
      },
      viewport: {
        northeast: {
          lat: parseFloat(`${(parseFloat(cityLat) - 0.005).toFixed(6)}`),
          lng: parseFloat(`${(parseFloat(cityLng) + 0.0156).toFixed(6)}`),
        },
        southwest: {
          lat: parseFloat(`${(parseFloat(cityLat) - 0.008).toFixed(6)}`),
          lng: parseFloat(`${(parseFloat(cityLng) + 0.012).toFixed(6)}`),
        },
      },
    };

    if (!cityName | !cityLat | !cityLng | !cityPhoto) {
      return alert("Please fill in all fields");
    }

    setDoc(myCityDoc, addingCity)
      // handingling promises
      .then(() => {
        alert("New city created");
      })
      .catch((error) => {
        alert("Error creating city");
      });
  };

  // READ SPECIFIC DOCUMENT FROM A COLLECTION

  // const Read = (restName) => {
  //   //Reading Docs
  //   const readDoc = doc(db, "restaurants", restName);
  //   getDoc(readDoc)
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setRests(snapshot.data());
  //       } else {
  //         alert("Restaurant does not exist");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Could not fetch restaurants from Firebase");
  //     });
  // };

  // const Update = (value, merge, loc) => {
  //   //updating doc
  //   const updateDoc = doc(db, "restaurants", loc);

  //   //setting merge true makes it merge with existing doc or it will create a new/fresh one
  //   setDoc(updateDoc, value, { merge: merge })
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setRests(snapshot.data());
  //       } else {
  //         alert("Updated Document!");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Could not update");
  //     });
  // };

  // Change Photo URL

  const changeImgName = async () => {
    try {
      const storage = await getStorage();
      const photoRef = await ref(storage, photo);
      await getDownloadURL(photoRef).then((url) => {
        setPhoto(url);
      });
      alert("Image Change Successful!");
    } catch (e) {
      alert("Name change failed :'(");
    }
  };

  const changeImgCityName = () => {
    try {
      const storage = getStorage();
      const photoRef = ref(storage, cityPhoto);
      getDownloadURL(photoRef).then((url) => {
        setCityPhoto(url);
      });
      alert("Image Change Successful!");
    } catch (e) {
      alert("Name change failed :'(");
    }
  };

  //IMAGE UPLOAD FUNCTION

  //I think the storage is triggering before image is picked or something of the sort. Need to wrap this in a promise to get result if filesize is small enough

  const uploadImageAsync = async (uri) => {
    // console.log("upload Image triggered");
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        // console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), `${name}-restaurant.jpg`);
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const pickImage = async () => {
    setIsLoading(true);

    if (!name) {
      setIsLoading(false);
      return alert("Enter restaurant name!");
    }

    getImageResult().then(async (result) => {
      // console.log(result);
      if (result.fileSize > 4000000 || result.cancelled === true) {
        setIsLoading(false);
        return alert("Image was canceled or too big boi");
      } else {
        setImage(result.uri);
        let image = result.uri;
        let url = await uploadImageAsync(image);
        if (url) {
          alert(url);
        }
        setPhoto(url);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const getImageResult = async () => {
    // console.log("get image triggered");
    return new Promise(async (resolve, reject) => {
      try {
        let Result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.all,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        // console.log("Restult", Result);
        if (Result) {
          // console.log("res");
          resolve(Result);
        } else {
          // console.log("no res");
          setIsLoading(false);
          resolve({});
        }
      } catch (e) {
        // console.log("no res");
        setIsLoading(false);
        reject({});
      }
    });
  };

  const pickCityImage = async () => {
    // console.log("pick city img triggered");
    setIsLoading(true);

    if (!cityName) {
      setIsLoading(false);
      return alert("Enter city name!");
    }

    getImageResult().then(async (result) => {
      // console.log(result);
      if (result.fileSize > 4000000 || result.cancelled === true) {
        setIsLoading(false);
        return alert("Image was canceled or too big boi");
      } else {
        setCityImage(result.uri);
        let image = result.uri;
        let url = await uploadImageAsync(image);
        // console.log(url);
        setCityPhoto(url);
        alert(url);
        setIsLoading(false);
      }
    });
  };

  const clearStore = () => {
    setImage();
    setDocName("failure");
    setName("");
    setUserName("");
    setPassword("");
    setEmail("");
    setAddress("");
    setMonHours("");
    setTuesHours("");
    setWedHours("");
    setThursHours("");
    setFriHours("");
    setSatHours("");
    setSunHours("");
    setDesc("");
    setPhoto("");
    setCity("");
    setLat(0);
    setLng(0);
    alert("Cleared inputs!");
  };

  const clearCity = () => {
    setCityLng("");
    setCityLat("");
    setCityName("");
    setCityDocName("failure");
    setCityPhoto("");
    setCityImage();
    alert("Cleared inputs!");
  };

  // READ IN ALL RESTAURANTS FROM COLLECTION

  useEffect(() => {
    try {
      onSnapshot(collection(db, "restaurants"), (snapshot) => {
        // console.log("snapSHOT");

        setRestList(snapshot.docs.map((doc) => doc.data()));
        setRestList(snapshot.docs.map((doc) => doc.data()));
        // console.log(restList);
      });
    } catch (e) {
      return;
    }
    // console.log(restList);
  }, [restList, modifyScreen]);

  // READ IN CITIES FROM COLLECTION

  useEffect(() => {
    try {
      onSnapshot(collection(db, "cities"), (snapshot) => {
        // console.log("snapSHOT");

        setCityList(snapshot.docs.map((doc) => doc.data()));
        setCityList(snapshot.docs.map((doc) => doc.data()));
        // console.log(restList);
      });
    } catch (e) {
      alert("Issue pulling collection list");
      return;
    }
  }, [cityList, modifyCityScreen]);

  //VARIABLES
  const [rests, setRests] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [docName, setDocName] = useState("failure");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [monHours, setMonHours] = useState("");
  const [tuesHours, setTuesHours] = useState("");
  const [wedHours, setWedHours] = useState("");
  const [thursHours, setThursHours] = useState("");
  const [friHours, setFriHours] = useState("");
  const [satHours, setSatHours] = useState("");
  const [sunHours, setSunHours] = useState("");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  //SCREENS
  const [createScreen, setCreateScreen] = useState(true);
  const [modifyScreen, setModifyScreen] = useState(false);
  const [cityScreen, setCityScreen] = useState(false);
  const [modifyStoreScreen, setModifyStoreScreen] = useState(true);
  const [modifyCityScreen, setModifyCityScreen] = useState(false);

  //USEEFFECT LISTS
  const [loading, setLoading] = useState(false);
  const [restList, setRestList] = useState([]);
  const [cityList, setCityList] = useState([]);

  //CITY VARIABLES
  const [cityLng, setCityLng] = useState(0);
  const [cityLat, setCityLat] = useState(0);
  const [cityName, setCityName] = useState("");
  const [cityDocName, setCityDocName] = useState("");
  const [cityPhoto, setCityPhoto] = useState("");
  const [cityImage, setCityImage] = useState();

  // const deleteHours = () => {
  //   delete restList[0].hours;
  //   delete restList[1].hours;
  //   delete restList[2].hours;
  // };

  const hours = {
    mon: {
      time: monHours,
      menus: [],
    },
    tues: {
      time: tuesHours,
      menus: [],
    },
    wed: {
      time: wedHours,
      menus: [],
    },
    thurs: {
      time: thursHours,
      menus: [],
    },
    fri: {
      time: friHours,
      menus: [],
    },
    sat: {
      time: satHours,
      menus: [],
    },
    sun: {
      time: sunHours,
      menus: [],
    },
  };

  return (
    <AccountBackground>
      <SafeAreaView>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={0}
        >
          <ScrollView>
            <AccountCover />
            <Spacer size="large" />
            <AdminContainer>
              <AdminButton
                mode="contained"
                onPress={() => {
                  setModifyScreen(false),
                    setCityScreen(false),
                    setCreateScreen(true);
                }}
              >
                Store
              </AdminButton>
              <AdminButton
                mode="contained"
                onPress={async () => {
                  //   await getAllRestaurants(),
                  //   await getSpecificRestaurants(),
                  setModifyScreen(false),
                    setCreateScreen(false),
                    setCityScreen(true);
                }}
              >
                City
              </AdminButton>
              <AdminButton
                mode="contained"
                onPress={async () => {
                  //   await getAllRestaurants(),
                  //   await getSpecificRestaurants(),
                  setModifyScreen(true),
                    setCreateScreen(false),
                    setCityScreen(false);
                }}
              >
                Manage
              </AdminButton>
            </AdminContainer>

            {createScreen && (
              <>
                <Spacer size="large" />
                {isLoading && <Text>Loading...</Text>}
                <Title>Enter New Restaurant</Title>
                <AccountContainer>
                  <AuthInput
                    label="Name"
                    value={name}
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(n) => {
                      setName(n), setDocName(n);
                    }}
                  />
                  <Spacer size="large">
                    <AuthInput
                      label="Username"
                      value={userName}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(u) => setUserName(u)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Password"
                      value={password}
                      textContentType="password"
                      keyboardType="default"
                      secureTextEntry
                      autoCapitalize="none"
                      onChangeText={(p) => setPassword(p)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Email"
                      value={email}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(e) => setEmail(e)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Phone Number"
                      value={phoneNumber}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(pn) => setPhoneNumber(pn)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Address"
                      value={address}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(a) => setAddress(a)}
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
                  <Spacer size="large">
                    <AuthInput
                      label="City"
                      value={city}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(c) => setCity(c)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Zip"
                      value={zip}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(z) => setZip(z)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="State"
                      value={state}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(s) => setState(s)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Latitude"
                      value={lat}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(l) => setLat(l)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Longitude"
                      value={lng}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(ln) => setLng(ln)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <Text>Hours</Text>
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Mon"
                      value={monHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(mo) => {
                        setMonHours(mo);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Tues"
                      value={tuesHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(tu) => {
                        setTuesHours(tu);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Wed"
                      value={wedHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(we) => {
                        setWedHours(we);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Thurs"
                      value={thursHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(thur) => {
                        setThursHours(thur);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Fri"
                      value={friHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(fri) => {
                        setFriHours(fri);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Sat"
                      value={satHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(sat) => {
                        setSatHours(sat);
                      }}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Sun"
                      value={sunHours}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(sun) => {
                        setSunHours(sun);
                      }}
                    />
                  </Spacer>
                  {isLoading && (
                    <Text style={{ color: "red" }}>IMAGE LOADING...</Text>
                  )}
                  {hasPermission === null && (
                    <>
                      <Spacer size="large">
                        <Text>No access to photos!</Text>
                      </Spacer>
                    </>
                  )}
                  {hasPermission !== null && (
                    <>
                      <Spacer size="large">
                        <AuthButton mode="contained" onPress={pickImage}>
                          Upload Image
                        </AuthButton>
                      </Spacer>
                    </>
                  )}

                  <Spacer size="large">
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {image && (
                        <Image
                          source={{ uri: image }}
                          style={{ width: 200, height: 200 }}
                        />
                      )}
                    </View>
                  </Spacer>
                  <Spacer size="large">
                    <AuthButton mode="contained" onPress={Create}>
                      Create
                    </AuthButton>
                  </Spacer>
                  <Spacer size="large">
                    <AuthButton mode="contained" onPress={clearStore}>
                      Clear
                    </AuthButton>
                  </Spacer>
                </AccountContainer>
              </>
            )}

            {/* {modifyScreen && (      SINGLE RESTAURANT ADMIN PANEL
              <>
                <Spacer size="large" />
                <Title>Modify Restaurants</Title>
                {restList[1] && (
                  <>
                    <Spacer size="large">
                      <AdminInfoCard {...restList[0]} />
                    </Spacer>
                    <Spacer size="large">
                      <AdminInfoCard {...restList[1]} />
                    </Spacer>
                    <Spacer size="large">
                      <AdminInfoCard {...restList[2]} />
                    </Spacer>
                  </>
                )} */}

            {modifyScreen && (
              <>
                <Spacer size="large" />
                <Title>Modify Screen</Title>
                <Spacer size="large" />
                <AdminContainer>
                  <AdminCreateModifyButton
                    mode="contained"
                    onPress={async () => {
                      setModifyCityScreen(true), setModifyStoreScreen(false);
                    }}
                  >
                    Manage cities
                  </AdminCreateModifyButton>
                  <AdminCreateModifyButton
                    mode="contained"
                    onPress={async () => {
                      setModifyCityScreen(false), setModifyStoreScreen(true);
                    }}
                  >
                    Manage stores
                  </AdminCreateModifyButton>
                </AdminContainer>
                {modifyStoreScreen && (
                  <>
                    <Spacer size="large" />
                    <AccountContainer>
                      {restList[1] && (
                        <View style={{ width: "100%" }}>
                          {restList.map((r, k) => (
                            <>
                              <Spacer size="large">
                                <AdminStoreInfoCard
                                  {...r}
                                  key={`${r.name}-k`}
                                />
                              </Spacer>
                            </>
                          ))}
                        </View>
                      )}
                    </AccountContainer>
                  </>
                )}
                {modifyCityScreen && (
                  <>
                    <Spacer size="large" />
                    <AccountContainer>
                      {cityList[1] && (
                        <>
                          {cityList.map((r, k) => (
                            <>
                              <Spacer size="large">
                                <AdminCityInfoCard {...r} key={`${r.name}-k`} />
                              </Spacer>
                            </>
                          ))}
                        </>
                      )}
                    </AccountContainer>
                  </>
                )}
              </>
            )}

            {cityScreen && (
              <>
                <Spacer size="large" />
                {isLoading && <Text>Loading...</Text>}
                <Title>Enter New City</Title>
                <AccountContainer>
                  <AuthInput
                    label="City name"
                    value={cityName}
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(n) => {
                      setCityName(n), setCityDocName(n);
                    }}
                  />

                  <Spacer size="large">
                    <AuthInput
                      label="Latitude"
                      value={cityLat}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(l) => setCityLat(l)}
                    />
                  </Spacer>
                  <Spacer size="large">
                    <AuthInput
                      label="Longitude"
                      value={cityLng}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(ln) => setCityLng(ln)}
                    />
                  </Spacer>

                  {isLoading && (
                    <Text style={{ color: "red" }}>IMAGE LOADING...</Text>
                  )}
                  {hasPermission === null && (
                    <>
                      <Spacer size="large">
                        <Text>No access to photos!</Text>
                      </Spacer>
                    </>
                  )}
                  {hasPermission !== null && (
                    <>
                      <Spacer size="large">
                        <AuthButton mode="contained" onPress={pickCityImage}>
                          Upload Image
                        </AuthButton>
                      </Spacer>
                    </>
                  )}

                  <Spacer size="large">
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cityImage && (
                        <Image
                          source={{ uri: cityImage }}
                          style={{ width: 200, height: 200 }}
                        />
                      )}
                    </View>
                  </Spacer>

                  <Spacer size="large">
                    <AuthButton mode="contained" onPress={addCity}>
                      Add City
                    </AuthButton>
                  </Spacer>
                  <Spacer size="large">
                    <AuthButton mode="contained" onPress={clearCity}>
                      Clear
                    </AuthButton>
                  </Spacer>
                </AccountContainer>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AccountBackground>
  );
};
