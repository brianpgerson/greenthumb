import React from 'react';
import { noCase } from 'change-case';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';

import { ErrorText } from './errors';
import { labelText } from './common-styles'

export const TextFormField = ({ 
  fieldName, 
  placeholder, 
  labelText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  formProps,
}) => {
  const { values, errors, touched, handleChange, setFieldTouched } = formProps;
  return (
    <View style={{ marginTop: 35 }}>
      {labelText && (<Text style={ styles.labelText }>{labelText}</Text>)}
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


export const SelectFormField = ({fieldName, items, styleProp, placeholder, formProps}) => {
  const { values, errors, touched, setFieldValue } = formProps;
  return (
  <View>
    <RNPickerSelect
        style={styleProp}
        placeholder={placeholder}
        onValueChange={itemValue => setFieldValue(fieldName, itemValue)}
        value={values[fieldName]} 
        items={items}
    />
    {touched[fieldName] && errors[fieldName] &&
      <Text numberOfLines={1} style={styles.errorTextSelect}>{noCase(errors[fieldName])}</Text>
    }
  </View>
)}

export const FormButton = ({ error, isValid, buttonText, title, submit }) => (
  <View>
    <Pressable style={styles.button} disabled={!isValid} title={title || buttonText} onPress={submit}>
      <Text>{buttonText}</Text>
    </Pressable>
    { error && (<ErrorText message={error}/>)}
  </View>
)


const styles = StyleSheet.create({
  labelText,
  errorText: {
    fontSize: 10, 
    color: 'red',
    position: 'absolute',
    bottom: -15,
  },
  errorTextSelect: {
    fontSize: 10, 
    color: 'red',
    position: 'absolute',
    width: 250,
    bottom: -20,
    paddingLeft: 10,
  },
  input: {
    color: '#9BCA26',
    width: 300,
    backgroundColor: '#141414',
    height: 40,
    paddingLeft: 5,
  },
  button: {
    width: 150,
    height: 40,
    color: 'black',
    backgroundColor: '#9BCA26',
    borderRadius: 3,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 35,
  },
});

export default TextFormField;