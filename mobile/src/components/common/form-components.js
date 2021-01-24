import React from 'react';
import { noCase } from 'change-case';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements'

import RNPickerSelect from 'react-native-picker-select';
import { ErrorText } from './errors';
import { labelText, COLORS, PADDING } from './common-styles'

export const TextFormField = ({ 
  fieldName, 
  placeholder, 
  labelText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  noMargin,
  formProps,
}) => {
  const { values, errors, touched, handleChange, setFieldTouched } = formProps;
  return (
    <View style={{ marginTop: noMargin ? 0 : 35 }}>
      {labelText && (<Text style={ styles.labelText }>{labelText}</Text>)}
      <TextInput style={styles.input}
        value={values[fieldName]}
        onChangeText={handleChange(fieldName)}
        placeholderTextColor="#5C5C5C"
        autoCapitalize={autoCapitalize}
        onBlur={() => setFieldTouched(fieldName)}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder === null ? '' : placeholder || fieldName}
      />
      {touched[fieldName] && errors[fieldName] &&
        <Text style={styles.errorText}>{noCase(errors[fieldName])}</Text>
      }
    </View>
  );
};


export const SimpleSelectFormField = ({ fieldName, options, styleProp, placeholder, onValueChange, value }) => {
  return (
  <View>
    <RNPickerSelect
        style={styleProp}
        placeholder={placeholder}
        onValueChange={onValueChange}
        value={value} 
        items={options}
    />
  </View>
)}

export const SelectFormField = ({fieldName, items, styleProp, placeholder, formProps}) => {
  const { values, errors, touched, setTouched, setFieldValue } = formProps;
  return (
  <View>
    <RNPickerSelect
        style={styleProp}
        placeholder={placeholder}
        onValueChange={itemValue => {
          setTouched({ ...touched, [fieldName]: true })
          setFieldValue(fieldName, itemValue)
        }}
        value={values[fieldName]} 
        items={items}
        props={formProps}
    />
    {touched[fieldName] && errors[fieldName] &&
      <Text numberOfLines={1} style={styles.errorTextSelect}>{noCase(errors[fieldName])}</Text>
    }
  </View>
)}


export const FormButton = ({ buttonStyle, error, isValid, buttonText, title, onPress }) => (
  <View>
    <TouchableOpacity style={{ ...styles.button, ...buttonStyle }} title={title || buttonText} onPress={onPress}>
      <Text>{buttonText}</Text>
    </TouchableOpacity>
    { error && (<ErrorText message={error}/>)}
  </View>
)

export const EditIcon = ({ onPress }) => (
  <Icon name="edit" 
        color={COLORS.GREEN.BRIGHT} 
        containerStyle={{ backgroundColor: COLORS.GREEN.DARK, padding: PADDING.XSMALL, borderRadius: 20 }} 
        onPress={onPress} />
);

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#9BCA26',
    textDecorationLine: 'underline',
  },
  inputAndroid: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#9BCA26',
    textDecorationLine: 'underline',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

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
    fontSize: 18,
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