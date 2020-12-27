import React, { Component, Fragment } from 'react';
import { random, get, sortBy, last } from 'lodash';
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
import ApiErrors from '../common/api-errors';
import { mainViewFlex, labelText, COLORS } from '../common/common-styles';
import { TextFormField, SelectFormField, FormButton } from '../common/form-components';

import { addPlant, updatePlant } from '../../middleware/plantApiThunks';
import { setApiErrors } from '../../actions/appActions';

const range = (start, end, length = end - start) => Array.from({ length }, (_, i) => start + i);

const RULE_NUMBER_VALUES = range(1, 31).map(n => ({ label: String(n), value: n }))

const OPTIONAL_RULE_NUMBER_VALUES = RULE_NUMBER_VALUES.map(
  ({ value, label }) => ({ value: value, label: ` to ${value} ` })
)

const YESTERDAY = 'Yesterday!';
const DAYS_AGO_VALUES = RULE_NUMBER_VALUES.map(
  ({ value, label }) => ({ value: value, label: value === 1 ? YESTERDAY : `${value} days ago` })
)

PLANT_NAMES = [
  'Fernie Sanders', 
  'Leaf Erickson', 
  'Rooty Giuliani', 
  'Twiggy Pop', 
  'Stemma Watson', 
  'Philodendron Collins',
  'Leaf Harvey Oswald'
];

const EMPTY_FORM = {
  name: '',
  type: '',
  ruleNumber: 7,
  optionalRuleNumber: 0,
  ruleCategory: 'days',
  daysAgo: '0',
};

export const daysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let dayCount = 0;

  while (end > start) {
    dayCount++;
    start.setDate(start.getDate() + 1);
  }

  return dayCount;
}

const getDaysAgo = ({ waterings = [] }) => {
  console.log(waterings);
  const sorted = sortBy(waterings, 'startDate');
  const lastComplete = last(sorted.filter(w => w.status === 'COMPLETE'));
  if (!lastComplete) {
    return 0;
  }

  const { startDate } = lastComplete;
  const daysAgo = daysBetweenDates(startDate, new Date());
  console.log(daysAgo);
  return daysAgo > 30 ? -1 : daysAgo;
};

const getEditValues = (editPlant) => ({ 
  name: editPlant.name,
  type: editPlant.type,
  ruleNumber: get(editPlant, ['schedule', 'ruleNumber'], 7),
  optionalRuleNumber: get(editPlant, ['schedule', 'rangeEnd'], 0) || 0,
  ruleCategory: get(editPlant, ['schedule', 'ruleCategory'], 'days'),
  daysAgo: getDaysAgo(editPlant)
});

const PlantForm = ({ route, navigation, setApiErrors }) => {
  const editPlant = get(route,  ['params', 'plant'], null);

  const init = editPlant ? getEditValues(editPlant) : EMPTY_FORM
  const [plantName, setPlantName] = React.useState(PLANT_NAMES[random(PLANT_NAMES.length - 1)]);
  useFocusEffect(React.useCallback(() => () => {
    setApiErrors(null);
    setPlantName(PLANT_NAMES[random(PLANT_NAMES.length - 1)])
  }, [setApiErrors, setPlantName]));

  return (
    <View style={styles.mainViewFlex}>
      <Formik
          enableReinitialize
          initialValues={init}
          onSubmit={async ({ name, type, ruleNumber, ruleCategory, optionalRuleNumber, daysAgo }, { resetForm }) => {
            const startFromDaysAgo = daysAgo === -1 ? ruleNumber : daysAgo
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - startFromDaysAgo);
            const requestBody = {
              plantRequest: { name, type },
              scheduleRequest: { ruleNumber, ruleCategory, rangeEnd: optionalRuleNumber || null },
              startDate,
            };
            try {
              if (editPlant) {
                await updatePlant(requestBody, editPlant.id)
              } else {
                await addPlant(requestBody);
              }
              navigation.goBack();
              resetForm(EMPTY);
              return;
            } catch (error) {
              setApiErrors(error.message);
            }
          }}
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
                  .test('is-valid-optional', 'Must be greater than initial value.', function (val) {
                    let originalValue = this.parent['ruleNumber'];
                    const isValid = val === 0 || val > originalValue;
                    return isValid;
                  }),
                ruleCategory: yup
                  .string()
                  .required(),
                daysAgo: yup
                  .number()
                  .required()
              })
          }
        >
          {({ isValid, resetForm, handleSubmit, initialValues, ...props  }) => {
            return (
              <Fragment>
              <View>
                <TextFormField labelText="Name:" fieldName="name" placeholder={plantName} formProps={props} />
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
                  <View>
                  <Text style={styles.labelText}>Last time watered: </Text>
                  <View style={styles.selectsContainer}>
                    <SelectFormField 
                      fieldName="daysAgo" 
                      placeholder={{}}
                      styleProp={pickerSelectStyles} 
                      items={[{ label: 'Today!', value: 0 }, ...DAYS_AGO_VALUES, { label: `Too long (I'm a monster!)`, value: -1 }]}
                      formProps={props}/>
                  </View>
                </View>
                <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <FormButton isValid={isValid} buttonText={`${editPlant ? 'Update' : 'Add Plant'}`} submit={handleSubmit} />
                </View>
                <ApiErrors />
              </View>
              <Button color={COLORS.GREEN.BRIGHT} onPress={() => { 
                resetForm({ values: EMPTY_FORM, touched: null, errors: null });
                navigation.goBack();
              }} title="Cancel" />
              </Fragment>
            )}}
        </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex,
  labelText: {
    ...labelText,
    marginTop: 35,
  },
  formContainer: {},
  selectsContainer: {
    backgroundColor: '#141414',
    color: '#9BCA26',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
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
    setApiErrors,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PlantForm);
