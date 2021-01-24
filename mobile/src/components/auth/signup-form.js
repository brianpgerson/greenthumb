import React, { Component, Fragment } from 'react';
import * as yup from 'yup'
import { Formik } from 'formik'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import { ErrorText } from '../common/errors';
import { mainViewFlex } from '../common/common-styles';
import { TextFormField, FormButton } from '../common/form-components';

import { signUp } from '../../middleware/authThunks';
import { authErrorSelector } from '../../selectors/authSelectors';
import { setAuthError } from '../../actions/authActions';


const SignInForm = ({ navigation, signUp, setAuthError, authError }) => {
  useFocusEffect(React.useCallback(() => () => setAuthError(null), [setAuthError]));

  return (
    <View style={styles.mainViewFlex}>
      <View style={styles.logo}>
        <Text>A LOGO</Text>
      </View>
      <View style={styles.inputContainer}>
        <Formik
          initialValues={{ email: '', password: '', passwordConfirmation: '' }}
          onSubmit={signUp}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email()
              .required(),
            password: yup
              .string()
              .min(8)
              .required(),
            passwordConfirmation: yup
              .string()
              .oneOf([yup.ref('password'), null], 'Passwords must match')
              .required(),
          })}
        >
          {({ isValid, handleSubmit, ...props  }) => (
            <Fragment>
              <TextFormField fieldName={'email'} formProps={props} />
              <TextFormField fieldName={'password'} formProps={props} secureTextEntry={true} />
              <TextFormField fieldName={'passwordConfirmation'} formProps={props} secureTextEntry={true} placeholder="confirm password" />
              <FormButton error={authError} isValid={isValid} buttonText={'Sign Up'} onPress={handleSubmit} />
            </Fragment>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewFlex,
  logo: {
    height: 100,
    width: 250,
    backgroundColor: 'darkblue',
    marginTop: 150,
  },
  inputContainer: {
    marginBottom: 100,
  }
});

const mapStateToProps = (state) => ({
  authError: authErrorSelector(state),
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signUp,
    setAuthError,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
