import React from 'react';
import { noCase } from 'change-case';
import { View, Text, TextInput, StyleSheet, Pressable} from 'react-native';

import { ErrorText } from './errors';

export const FormField = ({ 
  fieldName, 
  placeholder, 
  secureTextEntry = false,
  autoCapitalize = 'none',
  formProps,
}) => {
  const { values, errors, touched, handleChange, setFieldTouched } = formProps;
  return (
    <View>
      <TextInput style={styles.input}
        value={values[fieldName]}
        onChangeText={handleChange(fieldName)}
        placeholderTextColor="#5C5C5C"
        autoCapitalize={autoCapitalize}
        onBlur={() => setFieldTouched(fieldName)}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder || fieldName}
      />
      {touched[fieldName] && errors[fieldName] &&
        <Text style={styles.errorText}>{noCase(errors[fieldName])}</Text>
      }
    </View>
  );
};

export const FormButton = ({ error, isValid, buttonText, title, submit }) => (
  <View>
    <Pressable style={styles.button} disabled={!isValid} title={title || buttonText} onPress={submit}>
      <Text>{buttonText}</Text>
    </Pressable>
    { error && (<ErrorText message={error}/>)}
  </View>
)


const styles = StyleSheet.create({
  errorText: {
    fontSize: 10, 
    color: 'red',
    position: 'absolute',
    bottom: -15,
  },
  input: {
    color: '#D6F6DD',
    width: 300,
    backgroundColor: '#141414',
    height: 40,
    paddingLeft: 5,
    marginTop: 35,
  },
  button: {
    width: 150,
    height: 40,
    color: 'black',
    backgroundColor: '#D6F6DD',
    borderRadius: 3,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 35,
  },
});

export default FormField;