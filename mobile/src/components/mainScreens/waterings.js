import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import { mainViewFlex } from '../common/common-styles';

const Waterings = ({ navigation }) => {
  return (
    <View style={ styles.mainViewFlex }>
      <Text>Don't Break the Streak!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex
});

export default Waterings