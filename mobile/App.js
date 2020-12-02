import 'react-native-gesture-handler';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { appLoadingSelector } from './src/selectors/appSelectors';
import { validAccessTokenSelector } from './src/selectors/authSelectors'
import { validateJwtAsync } from './src/middleware/authThunks';

import SignUpForm from './src/components/auth/signup-form'
import SignInForm from './src/components/auth/signin-form'
import Waterings from './src/components/mainScreens/waterings'
import MyPlants from './src/components/mainScreens/my-plants'
import AddPlantForm from './src/components/mainScreens/add-plant-form';
import { defaultHeaderStyleOptions } from './src/components/common/common-styles';
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
      <SafeAreaView style={{ flex: 0, backgroundColor: '#0E2009' }}/>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#15300D' }}>
      <StatusBar barStyle="light-content" />
        {validAuth ? (
          <Drawer.Navigator drawerContent={(props) => <MainDrawerContent {...props} />}
            initialRouteName="Streak" 
            drawerStyle={{ backgroundColor: '#141414' }}>
            <Drawer.Screen name="Streak" component={Waterings} options={{ headerShown: false }} />
            <Drawer.Screen name="My Plants" component={MyPlants} options={{ headerShown: false }} />
            <Drawer.Screen name="Add Plant" 
                              component={AddPlantForm} 
                              options={{ 
                                title: 'Add a Plant',  
                                headerBackTitleVisible: false,
                                ...defaultHeaderStyleOptions,
                              }} />
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
  validAuth: validAccessTokenSelector(state),
  appLoading: appLoadingSelector(state),
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    validateJwtAsync,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
