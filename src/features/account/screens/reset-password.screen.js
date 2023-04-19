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
import { TouchableOpacity } from "react-native-gesture-handler";
import { ResetPasswordRequest } from "../../../services/authentication/authentication.service";

export const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const { onLogin, error, isLoading } = useContext(AuthenticationContext);
  const [localError, setLocalError] = useState(false);

  // useEffect(() => {
  //   setLocalError(error);
  // }, [error]);

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
      <Title>Enter Email</Title>
      <AccountContainer>
        <AuthInput
          label="Email"
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(u) => setEmail(u)}
        />
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
                ValidateEmail(email).then((result) => {
                  // console.log(result);
                  if (result === true) {
                    ResetPasswordRequest(email).then((res) => {
                      alert(
                        "Password reset sent! Please check email and spam folder."
                      );
                      navigation.goBack();
                      // console.log(res);
                    });
                  } else {
                    setLocalError(true);
                  }
                })
              }
            >
              Reset Password
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
