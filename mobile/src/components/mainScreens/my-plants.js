import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import { mainViewFlex } from '../common/common-styles';

const MyPlants = ({ navigation }) => {
  return (
    <View style={ styles.mainViewFlex }>
      <Text>Don't Break the Streak!</Text>
      <Button
        title="Create a Plant"
        onPress={() => navigation.navigate('Add Plant')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex
});

export default MyPlants