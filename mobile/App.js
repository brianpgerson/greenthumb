import 'react-native-gesture-handler';
import React from 'react';
import * as _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { completedInitSelector } from './src/selectors/appSelectors';
import { validAccessTokenSelector, isSigningInSelector, checkedJWTSelector } from './src/selectors/authSelectors'
import { attemptSignInWithJWT } from './src/middleware/authThunks';
import { initializeApp } from './src/middleware/initThunks';

import SignUpForm from './src/components/auth/signup-form'
import SignInForm from './src/components/auth/signin-form'
import Streak from './src/components/mainScreens/streak-calendar'
import MyPlants from './src/components/mainScreens/my-plants'
import PlantForm from './src/components/mainScreens/plant-form';
import { defaultHeaderStyleOptions, COLORS } from './src/components/common/common-styles';
import MainDrawerContent from './src/components/main-drawer';

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

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

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
        indicatorStyle: { backgroundColor: '#9BCA26' },
        activeTintColor: '#9BCA26',
        inactiveTintColor: '#B38A58',
        activeBackgroundColor: '#15300D',
        inactiveBackgroundColor: '#15300D',
        style: { paddingTop: 10, backgroundColor: '#15300D'},
      }}
    >
      <RootStack.Screen name="Sign In" component={SignInForm} />
      <RootStack.Screen name="Sign Up" component={SignUpForm} />
    </Tab.Navigator>
  );
};

const App = ({ 
  signedIn,
  checkedJWT,
  signingIn,
  initialized,
  attemptSignInWithJWT,
 }) => {
  console.log('starting up!')
  if (signingIn) {
    return (<SplashScreen/>);
  } else if (!checkedJWT && !signedIn && !signingIn) {
    console.log('going to sign in with JWT!')
    attemptSignInWithJWT()
    return (<SplashScreen/>);
  } else if (signedIn && !initialized) {
    console.log('initializing app!')
    initializeApp()
    return (<SplashScreen/>);
  } 

  
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.GRAY.DARKEST }}/>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.GRAY.DARKEST }}>
      <StatusBar barStyle="light-content" />
        {signedIn ? (
          <Drawer.Navigator drawerContent={(props) => <MainDrawerContent {...props} />}
            initialRouteName="Streak" 
            drawerStyle={{ backgroundColor: COLORS.GRAY.DARKEST }}>
            <Drawer.Screen name="Streak" component={Streak} options={{ title: "Don't Break the Streak!", headerShown: true, ...defaultHeaderStyleOptions }} />
            <Drawer.Screen name="My Plants" component={MyPlants} options={{ title: 'My Plants', headerShown: true, ...defaultHeaderStyleOptions }} />
            <Drawer.Screen name="Add Plant" 
                              component={PlantForm} 
                              options={({ route }) => ({ 
                                title: _.get(route, ['params', 'plant']) ? `Edit ${route.params.plant.name}` : 'Add a Plant',
                                headerShown: true,
                                headerBackTitleVisible: false,
                                ...defaultHeaderStyleOptions,
                              })} />
          </Drawer.Navigator>
        ) : (
          <AuthTabs />
        )}
        </SafeAreaView>
      </NavigationContainer>

  )
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#15300D',
  },
});

const mapStateToProps = (state) => ({
  checkedJWT: checkedJWTSelector(state),
  signingIn: isSigningInSelector(state),
  signedIn: validAccessTokenSelector(state),
  initialized: completedInitSelector(state),
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    attemptSignInWithJWT,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
