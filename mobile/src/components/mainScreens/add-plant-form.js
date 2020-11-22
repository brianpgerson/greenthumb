import React, { Component, Fragment } from 'react';
import { random } from 'lodash';
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

import RNPickerSelect from 'react-native-picker-select';

import { ErrorText } from '../common/errors';
import { mainViewFlex, labelText } from '../common/common-styles';
import { TextFormField, SelectFormField, FormButton } from '../common/form-components';

const range = (start, end, length = end - start) => Array.from({ length }, (_, i) => start + i);

const RULE_NUMBER_VALUES = range(1, 31).map(n => ({ label: String(n), value: n }))

OPTIONAL_RULE_NUMBER_VALUES = RULE_NUMBER_VALUES.map(
  ({ value, label }) => ({ value: value, label: ` to ${value} ` })
)

PLANT_NAMES = ['Fernie Sanders', 'Leaf Erickson', 'Rooty Giuliani', 'Twiggy Pop']

const AddPlantFormModal = ({ navigation, authError }) => {
  return (
    <View style={styles.mainViewFlex}>
      <Formik
          initialValues={{ 
            name: '', 
            type: '', 
            ruleNumber: 7,
            optionalRuleNumber: '',
            ruleCategory: 'days',
          }}
          onSubmit={(args) => console.log(args)}
          validationSchema={
            yup.object()
              .shape({
                name: yup
                  .string()
                  .required(),
                type: yup
                  .string()
                  .required(),
                ruleNumber: yup
                  .number()
                  .required(),
                optionalRuleNumber: yup
                  .number()
                  .test('is-valid-optional', `Must be greater than initial value.`, function (val) {
                    let originalValue = this.parent['ruleNumber'];
                    return val === 0 || val > originalValue;
                  }),
                ruleCategory: yup
                  .string()
                  .required(),
              })
          }
        >
          {({ isValid, handleSubmit, initialValues, ...props  }) => {
            return (
              <View>
                <TextFormField labelText="Name:" fieldName="name" placeholder={PLANT_NAMES[random(PLANT_NAMES.length - 1)]} formProps={props} />
                <TextFormField labelText="Type:" fieldName="type" placeholder="Monstera" formProps={props}  />
                <View>
                  <Text style={styles.labelText}>Water every: </Text>
                  <View style={styles.selectsContainer}>
                      <SelectFormField 
                        fieldName="ruleNumber" 
                        placeholder={{}}
                        styleProp={pickerSelectStyles} 
                        items={RULE_NUMBER_VALUES} 
                        formProps={props}/>
                      <SelectFormField 
                        fieldName="optionalRuleNumber" 
                        placeholder={{}}
                        styleProp={pickerSelectStyles} 
                        items={[{ label: ' exact (no range) ', value: 0 }, ...OPTIONAL_RULE_NUMBER_VALUES]}
                        formProps={props}/>
                      <SelectFormField 
                        fieldName="ruleCategory" 
                        placeholder={{}}
                        styleProp={pickerSelectStyles} 
                        items={[{ label: 'days', value: 'days' }, { label: 'weeks', value: 'weeks' }]}
                        formProps={props}/>
                  </View>
                </View>
                <FormButton isValid={isValid} buttonText={'Add Plant'} submit={handleSubmit} />
              </View>
            )
          }
        }
        </Formik>
      <Button onPress={() => navigation.goBack()} title="Cancel" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex,
  labelText: {
    ...labelText,
    marginTop: 35,
  },
  formContainer: {

  },
  selectsContainer: {
    backgroundColor: '#141414',
    color: '#9BCA26',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#9BCA26',
    textDecorationLine: 'underline',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddPlantFormModal);

