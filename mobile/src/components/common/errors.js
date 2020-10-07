import * as React from 'react';

import { Text, StyleSheet } from 'react-native';

export const ErrorText = ({ message }) => (
  <Text style={styles.errorText}>{message}</Text>
)

const styles = StyleSheet.create({
  errorText: {
    position: 'absolute',
    color: 'red',
    bottom: -40,
  },
});