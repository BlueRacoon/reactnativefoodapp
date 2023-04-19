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
  ForgotPass,
  Title,
} from "../components/account.styles";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { Navigation } from "../../../infrastructure/navigation";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { CartPaymentProcessing } from "../../cart/components/cart.styles";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, error, isLoading } = useContext(AuthenticationContext);
  const [localError, setLocalError] = useState(false);

  useEffect(() => {
    setLocalError(false);
  }, []);

  useEffect(() => {
    if (error.length === 0) {
      setLocalError(false);
    } else {
      setLocalError(error);
    }
  }, [error]);

  function ValidateEmail(mail) {
    setLocalError(false);
    return new Promise((resolve, reject) => {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        resolve(true);
      } else {
        setLocalError(true);
        resolve(false);
      }
    });
  }

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Welcome</Title>
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
        {localError && (
          <ErrorContainer size="large">
            <Text style={{ color: "red" }}>Invalid email/password entry</Text>
          </ErrorContainer>
        )}

        <Spacer size="large">
          {!isLoading ? (
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={() =>
                ValidateEmail(email)
                  .then((result) => {
                    // console.log("result: ", result);
                    if (result === true) {
                      onLogin(email, password).then((res) => {
                        // console.log("res on login button: ", res);
                        // typeof res === "undefined" ? setLocalError(true) : null;
                      });
                    } else {
                      // console.log("trigs1");
                      setLocalError(true);
                    }
                  })
                  .catch((e) => {
                    // console.log("trigs2");
                    setLocalError(true);
                  })
              }
            >
              Login
            </AuthButton>
          ) : (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          )}
        </Spacer>
        <Spacer size="large" />
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <ForgotPass>
            <Text>Reset Password</Text>
          </ForgotPass>
        </TouchableOpacity>
      </AccountContainer>
      <Spacer size="large">
        <AuthButton
          mode="contained"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Back
        </AuthButton>
      </Spacer>
    </AccountBackground>
  );
};
