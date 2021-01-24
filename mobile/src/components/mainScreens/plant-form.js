import React, { Component, Fragment } from 'react';
import { random, get, sortBy, head } from 'lodash';
import * as R from 'ramda';
import { DateTime } from 'luxon';
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
  Modal,
  StyleSheet,
  Alert,
  TouchableHighlight,
} from 'react-native';

import { ErrorText } from '../common/errors';
import ApiErrors from '../common/api-errors';
import { mainViewFlex, labelText, COLORS } from '../common/common-styles';
import ModalWrapper from '../common/modal-wrapper';
import { pickerSelectStyles, TextFormField, SelectFormField, FormButton } from '../common/form-components';

import { addAndReloadPlants, updateAndReloadPlants, deletePlant, retrieveAndReloadPlants } from '../../middleware/plantApiThunks';
import { setApiErrors } from '../../actions/appActions';
import { createTwoButtonAlert } from '../common/alert';
import { range, getToday, toCalendarDay, mapWateringDateStringstoLuxon } from '../../utils/generalUtils';

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

const getDaysAgo = ({ waterings = [] }) => {
  const lastComplete = R.pipe(
    R.filter(R.propEq('status', 'COMPLETE')),
    R.map(mapWateringDateStringstoLuxon),
    R.sortBy(R.path(['wateringDate', 'ts'])),
    R.last,
  )(waterings)

  const { wateringDate } = lastComplete;
  const daysAgo = getToday().diff(wateringDate, 'days').days;
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

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const onDeletePress = () => setShowDeleteModal(true);
  const dismissDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = (navigation, plantId) => async() => {
    try {
      const deleted = await deletePlant(plantId);
      await retrieveAndReloadPlants();
      dismissDeleteModal();
      navigation.navigate('My Plants');
    } catch (error) {
      createTwoButtonAlert('Error', 'There was an error deleting this plant! Try again later.');
    }
  } 

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
            const wasWatered = daysAgo !== -1;
            const lastWateredDaysAgo = wasWatered ? daysAgo : 0;
            let lastWateredDate = getToday();

            if (wasWatered) {
              lastWateredDate = lastWateredDate.minus({ days: daysAgo });
            }

            const requestBody = {
              plantRequest: { name, type },
              scheduleRequest: { ruleNumber, ruleCategory, rangeEnd: optionalRuleNumber || null },
              lastWatered: wasWatered ? lastWateredDate.toISODate() : null,
            };
            try {
              if (editPlant) {
                await updateAndReloadPlants(requestBody, editPlant.id)
              } else {
                await addAndReloadPlants(requestBody);
              }
              resetForm(EMPTY_FORM);
              navigation.goBack();
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
                {editPlant ? (<ModalWrapper 
                  modalTitle={`Delete ${editPlant.name}?`}
                  modalVisible={showDeleteModal} 
                  onDismiss={dismissDeleteModal}
                  actions={[
                    { 
                      onPress: confirmDelete(navigation, editPlant.id), 
                      text: "Delete", 
                      extraStyles: { backgroundColor: COLORS.RED.BRIGHT, borderWidth: 0 }  }
                    ]}>
                  <View style={{ paddingVertical: 25 }}>
                    <Text style={{ color: COLORS.GRAY.LIGHTMED }}>Are you sure you want to delete this plant?</Text>
                  </View>
                </ModalWrapper>) : null}
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
                  <FormButton isValid={isValid} buttonText={`${editPlant ? 'Update' : 'Add Plant'}`} onPress={handleSubmit} />
                  {editPlant ? (
                    <FormButton 
                      isValid={true} 
                      buttonStyle={{ backgroundColor: COLORS.RED.BRIGHT }} 
                      buttonText="Delete" 
                      onPress={onDeletePress} 
                    />) : null}
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


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setApiErrors,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PlantForm);

