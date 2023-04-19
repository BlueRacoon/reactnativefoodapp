/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect } from "react";
import { Text } from "../../../components/typography/text.component";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  AccountBackground,
  AccountContainer,
  AccountCover,
  AuthButton,
  AuthInput,
  ErrorContainer,
  Title,
} from "../components/account.styles";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { Navigation } from "../../../infrastructure/navigation";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(false);
  const { onRegister, error, isLoading } = useContext(AuthenticationContext);

  useEffect(() => {
    setLocalError(false);
    // console.log(localError);
  }, []);

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Register Now!</Title>
      <AccountContainer>
        <AuthInput
          label="Email"
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(u) => setEmail(u)}
        />

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
            label="Repeat Password"
            value={repeatedPassword}
            textContentType="password"
            keyboardType="default"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(rp) => setRepeatedPassword(rp)}
          />
        </Spacer>
        {localError && localError !== "Please fill in all fields" && (
          <ErrorContainer size="large">
            <Text style={{ color: "red" }}>{error}</Text>
          </ErrorContainer>
        )}

        {localError === "Please fill in all fields" && (
          <ErrorContainer size="large">
            <Text style={{ color: "red" }}>{localError}</Text>
          </ErrorContainer>
        )}
        <Spacer size="large">
          {!isLoading ? (
            <AuthButton
              icon="email"
              mode="contained"
              onPress={() => {
                // console.log("trigs");
                if (!email | !password | !repeatedPassword) {
                  setLocalError("Please fill in all fields");
                  return;
                }
                onRegister(email, password, repeatedPassword).then(
                  (res) =>
                    typeof res === "undefined" ? setLocalError(true) : null
                  // console.log(res)
                );
              }}
            >
              Register
            </AuthButton>
          ) : (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          )}
        </Spacer>
      </AccountContainer>
      <Spacer size="large">
        <AuthButton mode="contained" onPress={() => navigation.goBack()}>
          Back
        </AuthButton>
      </Spacer>
    </AccountBackground>
  );
};
