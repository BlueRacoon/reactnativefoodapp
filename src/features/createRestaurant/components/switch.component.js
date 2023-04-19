/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import { colors } from "../../../infrastructure/theme/colors";

const SwitchButton = ({ toggle }) => {
  const [isEnabled, setIsEnabled] = useState(toggle);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#FF6347", true: "#138000" }}
        thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SwitchButton;
