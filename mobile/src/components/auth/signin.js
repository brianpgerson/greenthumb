import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';

import { signIn } from '../../middleware/authThunks';

const SignInScreen = ({ navigation, signIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('')

  return (
    <View style={styles.view}>
      <TextInput 
        style={styles.input}
        autoCapitalize={'none'}
        placeholderTextColor="lightgray"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="lightgray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} title="Sign in" onPress={() => signIn({ email, password })}>
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
    color: 'black',
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
    signIn,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);