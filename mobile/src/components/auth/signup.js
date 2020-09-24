import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  Text
} from 'react-native';

import { signUp } from '../../middleware/authThunks';

const checkEquivalents = (p1, p2) => p1 === p2;

const SignUpScreen = ({ navigation, signUp }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('')
  const [confirmedPassword, setConfirmedPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')

  const onSetPassword = (passwordVal) => {
    if (confirmedPassword !== '') {
      const match = checkEquivalents(passwordVal, confirmedPassword);
      if (!match) {
        setPasswordError(`Passwords don't match!`);
      }
    }
    setPassword(passwordVal)
  }

  const onSetConfirmedPassword = (passwordVal) => {
    if (password !== '') {
      const match = checkEquivalents(passwordVal, password);
      if (!match) {
        setPasswordError(`Passwords don't match!`);
      }
    }
    setConfirmedPassword(passwordVal)
  }

  return (
    <View style={styles.view}>
      <TextInput
        autoCapitalize={'none'}
        style={styles.input}
        placeholderTextColor="white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={onSetPassword}
        placeholderTextColor="white"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmedPassword}
        onChangeText={onSetConfirmedPassword}
        placeholderTextColor="white"
        secureTextEntry
      />
      <Pressable style={styles.button} title="Sign Up" onPress={() => signUp({ email, password })}>
        <Text>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const mapStateToProps = (state) => ({});

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#04030F',
    color: '#D6F6DD',
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    borderColor: '#D6F6DD',
    borderWidth: 1,
    color: '#D6F6DD',
    width: 200,
    height: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: 100,
    height: 40,
    color: '#04030F',
    backgroundColor: '#D6F6DD',
    borderRadius: 3,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center'
  }
});
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signUp,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);