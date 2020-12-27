import React from 'react';
import { Alert } from 'react-native';

export const createTwoButtonAlert = (title, message, extraFuncButton) => {
  const buttons = [{
    text: "Cancel",
    onPress: () => console.log("Cancel Pressed"),
    style: "cancel"
  }];

  if (extraFuncButton) {
    buttons.push(extraFuncButton)
  };

  return Alert.alert(title, message, buttons, { cancelable: false })
}
   