import 'react-native-gesture-handler';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { appLoadingSelector } from './src/selectors/appSelectors';
import { validatedAuthSelector } from './src/selectors/authSelectors'
import { validateJwtAsync } from './src/middleware/authThunks';

import SignUpForm from './src/components/auth/signup-form'
import SignInForm from './src/components/auth/signin-form'

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

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

const AuthTabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Sign In') {
            iconName = focused
              ? 'enter-sharp'
              : 'enter-outline';
          } else if (route.name === 'Sign Up') {
            iconName = focused ? 'person-add-sharp' : 'person-add-outline';
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        showIcon: true,
        labelStyle: { fontSize: 10 },
        indicatorStyle: { backgroundColor: '#d6f6dd' },
        activeTintColor: '#64F58D',
        inactiveTintColor: '#BD8B9C',
        activeBackgroundColor: '#04030F',
        inactiveBackgroundColor: '#04030F',
        style: { paddingTop: 10, backgroundColor: '#04030F'},
      }}
    >
      <Stack.Screen name="Sign In" component={SignInForm} />
      <Stack.Screen name="Sign Up" component={SignUpForm} />
    </Tab.Navigator>
  );
};

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
      <SafeAreaView style={{ flex: 0, backgroundColor: '#04030F' }}/>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#04030F' }}>
      <StatusBar barStyle="light-content" />
        {validAuth ? (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }}/>
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        ) : (
          <AuthTabs />
        )}
        </SafeAreaView>
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
