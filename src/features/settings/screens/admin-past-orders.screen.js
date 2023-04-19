/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from "react";
import { Text } from "../../../components/typography/text.component";
import { SafeArea } from "../../../components/utils/safe-area.component";
import { OrdersContext } from "../../../services/orders/orders.context";
import {
  AuthButton,
  AdminButton,
  AdminContainer,
  DropDownContainer,
} from "../../account/components/account.styles";
import { View, Dimensions } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { ScrollView } from "react-native-gesture-handler";

import DropDownPicker from "react-native-dropdown-picker";
import { RestaurantBackendContext } from "../../../services/restaurant-backend/restaurant-backend.context";
import { RestaurantPastOrderCard } from "../../orders/components/restaurant-past-order-card.component";
import { PaymentProcessing } from "../../cart/components/cart.styles";

export const AdminPastOrders = ({ navigation }) => {
  const { getOldOrders, oldOrders, isLoading } = useContext(OrdersContext);

  const [openMenusItem, setOpenMenusItem] = useState(false);
  const [valueMenusItem, setValueMenusItem] = useState(null);
  const [getMenusItems, setGetMenusItems] = useState();
  const [localDateUsed, setLocalDateUsed] = useState(null);

  const { width, height } = Dimensions.get("window");
  const aspectRatio = height / width;

  function allAreNull(arr) {
    if (!arr.length) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    let StartAt = "2022-07-10";
    var b = new Date();
    b.setMinutes(b.getMinutes() - b.getTimezoneOffset());

    var now = new Date();
    var daysOfYear = [];
    for (
      var useD = new Date(StartAt);
      useD <= now;
      useD.setDate(useD.getDate() + 1)
    ) {
      daysOfYear.push({
        label: new Date(useD).toISOString().slice(0, 10),
        value: new Date(useD).toISOString().slice(0, 10),
      });
      if (useD.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)) {
        setGetMenusItems(daysOfYear);
      }
    }
  }, []);

  return (
    <SafeArea>
      <View
        style={{ justifyContent: "center", alignItems: "center", zIndex: 150 }}
      >
        <Spacer size="large" />
        <Spacer size="large" />
        <Text style={{ fontSize: 25 }}>Select a date</Text>

        <DropDownContainer zIndex={150}>
          <Spacer size="large">
            <DropDownPicker
              style={{
                borderColor: "#E7E7E7",
                color: "green",
                backgroundColor: "#E7E7E7",
                borderRadius: 5,
                height: 61,
                zIndex: 101,
                // fontFamily: "Oswald_400Regular",
              }}
              inputIOS={{
                color: "white",
                fontSize: 35,
                zIndex: 100,
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
                // console.log("item selected");
                // console.log("item:", item);
                setLocalDateUsed(item);
                getOldOrders(item);
              }}
            />
          </Spacer>
        </DropDownContainer>
        <Spacer size="large" />
        <AdminButton
          onPress={() => {
            if (localDateUsed) {
              getOldOrders(localDateUsed);
            } else {
              alert("Please choose a date");
            }
          }}
          mode="contained"
        >
          Refresh
        </AdminButton>
      </View>
      <Spacer size="large" />
      {isLoading && (
        <>
          <PaymentProcessing />
        </>
      )}
      {oldOrders.length === 0 && !isLoading && (
        <>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "60%",
            }}
          >
            <Text>No orders!</Text>
          </View>
        </>
      )}
      <View
        style={{
          zIndex: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {oldOrders && (
          <>
            <ScrollView
              style={{
                height: (height - aspectRatio * height * 0.0475) * 0.59,
                width: width,

                padding: 15,
                zIndex: 90,
              }}
            >
              {Object.keys(oldOrders).map((item, i) => {
                return (
                  <>
                    <RestaurantPastOrderCard
                      props={oldOrders[item]}
                      navigation={navigation}
                      today={valueMenusItem}
                    />
                    <Spacer size="large" />
                  </>
                );
              })}
              <Spacer size="large" />
            </ScrollView>
          </>
        )}
      </View>
    </SafeArea>
  );
};
