import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  View,
  StyleSheet,
  Button,
  Text,
  StatusBar,
} from 'react-native';

import { setActiveDrawerScreen } from '../actions/drawerActions';
import { signOutAndRemoveJwt } from '../middleware/authThunks';
import { activeDrawerScreenSelector } from '../selectors/drawerSelectors';

const navigateTo = (navigation, title, setActive) => {
  setActive(title);
  navigation.navigate(title);
}

const CustomDrawerItem = ({ onPress, label, active, screenName, navigation, setActive }) => (
  <DrawerItem 
    style={styles.drawerButton}
    label={label} 
    focused={screenName === active}
    activeBackgroundColor="#15300D"
    inactiveBackgroundColor="#141414"
    labelStyle={{ color: '#F8FCEE' }}
    onPress={() => {
      if (onPress !== undefined) {
        onPress()
        setActive(null);
      } else {
        navigateTo(navigation, screenName, setActive)
      }
    }} />
)

const MainDrawerContent = ({ navigation, activeScreen, setActiveDrawerScreen }) => (
  <DrawerContentScrollView style={styles.container}>
    <View style={styles.mainDrawerHeader}>
      <Text style={styles.mainDrawerHeaderText}>greenthumb</Text>
    </View>
    <CustomDrawerItem 
      label="Streak" 
      screenName="Streak"
      active={activeScreen} 
      navigation={navigation}
      setActive={setActiveDrawerScreen}/>
    <CustomDrawerItem 
      label="My Plants" 
      screenName="My Plants"
      active={activeScreen} 
      navigation={navigation}
      setActive={setActiveDrawerScreen}/>
    <CustomDrawerItem 
      label="Log Out" 
      screenName="Sign In"
      active={activeScreen} 
      navigation={navigation}
      onPress={() => signOutAndRemoveJwt()}
      setActive={setActiveDrawerScreen}/>
  </DrawerContentScrollView>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  mainDrawerHeader: {
    height: 60,
    padding: 10
  },
  mainDrawerHeaderText: {
    color: '#9BCA26',
    fontSize: 28,
  },
  drawerButton: {
    borderBottomColor: "gray",
    borderBottomWidth: 1
  }
});

const mapStateToProps = (state) => ({
  activeScreen: activeDrawerScreenSelector(state),
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setActiveDrawerScreen,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawerContent);
