import 'react-native-gesture-handler';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { appLoadingSelector } from './src/selectors/appSelectors';
import { validatedAuthSelector } from './src/selectors/authSelectors'
import { validateJwtAsync } from './src/middleware/authThunks';
import SignIn from './src/components/auth/signin'
import SignUp from './src/components/auth/signup'

import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const SplashScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Greenthumb</Text>
  </View>
);

const App = ({ validAuth, appLoading, validateJwtAsync }) => {
  console.log('start')
  if (!validAuth && appLoading) {
    console.log('validating')
    validateJwtAsync()
  } 
  
  if (appLoading) {
    return (<SplashScreen />)
  }
  
  return (
      <NavigationContainer>
        {validAuth ? (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }}/>
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator>
            <Stack.Screen name="Sign In" component={SignIn} />
            <Stack.Screen name="Sign Up" component={SignUp} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
});

const mapStateToProps = (state) => ({
  validAuth: validatedAuthSelector(state),
  appLoading: appLoadingSelector(state),
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    validateJwtAsync,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
