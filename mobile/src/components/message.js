import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMessage } from '../middleware/apiThunks';
import { selectFormattedMessage } from '../selectors/messageSelectors';

const Message = ({ message, getMessage }) => {  
  return (
    <View style={styles.container}>
      <Text>You have a message: {message}</Text>
      <Button
        title="get message"
        onPress={getMessage}
      />
      <Text>arf</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  message: selectFormattedMessage(state)
});


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getMessage,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Message);