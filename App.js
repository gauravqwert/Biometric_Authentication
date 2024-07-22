import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Alert,
  TouchableHighlight,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // for face detection pr fingerprint scan

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      // hasHardwareAsync() -> Determine whether a face or fingerprint scanner is available on the device.
      setIsBiometricSupported(compatible);
    })();
  });
  const fallBackToDefaultAuth = () => {
    console.log("fall back to password authentication");
  };

  const alertComponent =(title,mess,btnTxt,btnFunc) => {
    return Alert.alert(title,mess,[
      {
        text : btnTxt,
        onPress :btnFunc,
      }
    ]);
  };

  const TwoButtonAlert = () => 
    Alert.alert('Welcome To App','Hello Users',[
      {
        text : 'Back',
        onPress : () => console.log('Cancel Pressed'),
        style:'cancel'
      },
      {
        text : 'Ok',
        onPress :() => console.log('Ok Pressed')
      },
    ]);

    const handleBiometricAuth = async () => {
      // check if hardware supportd biometric
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

      // fall back to default authentication method (password) if biometric is not available

      if(!isBiometricAvailable)
        return alertComponent(
          'Please Enter Your Password',
          'Biometric Auth not Supported',
          'Ok',
          () => fallBackToDefaultAuth()
        );

        // check biometric types available (fingerprint,facial Recognition,iris recognition)

        let supportedBiometrics;
        if(isBiometricAvailable)
          supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
        // supportedAuthenticationTypesAsync() ->Determine what kinds of authentications are available on the device.

        // check biometrics are saved locally in user's device
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        // isEnrolledAsync() -> Determine whether the device has saved fingerprints or facial data to use for authentication.
        if(!savedBiometrics)
          return alertComponent(
        'Biometric record not found',
        'Please Login With Password',
        'Ok',
        () => fallBackToDefaultAuth()
        );

        // authenticate with biometric

        const biometricAuth = await LocalAuthentication.authenticateAsync({
          // authenticateAsync() ->Attempts to authenticate via Fingerprint/TouchID (or FaceID if available on the device).
          promptMessage : 'Login With Biometrics',
          cancelLabel: 'cancel',
          disableDeviceFallback :true,
        });

        // log the user in on success
        if(biometricAuth){TwoButtonAlert()};
        console.log({isBiometricAvailable});
        console.log({supportedBiometrics});
        console.log({savedBiometrics});
        console.log({biometricAuth});
    };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>
          {isBiometricSupported
          ? 'Your Device is Compatible with Biometrics' :
          'Face or FingerPrint Scanner is available on this device'}
       </Text>
       <TouchableHighlight
         style={{
          height : 60,
          marginTop: 200,
          padding:5,
         }}
        >
         <Button 
          title="Login With Biometrics"
          color='black'
          onPress={handleBiometricAuth}
         />
       </TouchableHighlight>
       <StatusBar style="auto"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:StatusBar.currentHeight
  },
});
