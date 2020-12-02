import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Text, StyleSheet, View } from 'react-native';

import { apiErrorsSelector } from '../../selectors/appSelectors';
import { setApiErrors } from '../../actions/appActions';

const ApiErrors = ({ apiErrors }) => (
  <View style={{ marginTop: 30 }}>
    <Text style={styles.errorText}>{apiErrors}</Text>
  </View>
)

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
});

const mapStateToProps = (state) => ({
  apiErrors: apiErrorsSelector(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setApiErrors,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ApiErrors);

