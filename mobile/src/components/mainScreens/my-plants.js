import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { mainView, flexRow, COLORS, PADDING } from '../common/common-styles';
import { createTwoButtonAlert } from '../common/alert';
import { Card } from '../common/card';
import { LabelText } from '../common/common-components';

import { allPlantsSelector } from '../../selectors/plantSelectors';
import { retrieveAndReloadPlants, deletePlant } from '../../middleware/plantApiThunks';

export const generateFormattedRule = (schedule) => {
  if (!schedule) {
    return 'Add a watering schedule!';
  } 
  const { ruleNumber, ruleCategory, rangeEnd } = schedule;
  return `Water every ${ruleNumber} ${rangeEnd ? `to ${rangeEnd} ` : ''}${ruleCategory}`;
}

const onDeletePlant = async (plantId) => {
  try {
    const deleted = await deletePlant(plantId);
    await retrieveAndReloadPlants();
  } catch (error) {
    createTwoButtonAlert('Error', 'There was an error deleting this plant! Try again later.');
  }
} 

const PlantCard = (navigation) => ({ item: plant }) => (
  <Card onPress={() => navigation.navigate('Add Plant', { plant })}>
    <View>
      <Text style={styles.title}>{plant.name}</Text>
      <View style={styles.flexRow}>
        <LabelText style={{ color: COLORS.GREEN.BRIGHT }}>{plant.type} - </LabelText>
        <LabelText style={{ color: COLORS.GREEN.BRIGHT }}>{generateFormattedRule(plant.schedule)}</LabelText>
      </View>
    </View>
  </Card>
)

const renderHiddenItem = (data, rowMap) => (
  <View style={styles.rowBack}>
    <Text>Left</Text>
    <TouchableOpacity
      style={[styles.backRightBtn, styles.backRightBtnRight]}
      onPress={() => onDeletePlant(data.item.id)}>
      <Text style={{ color: '#FFF' }}>Delete</Text>
    </TouchableOpacity>
  </View>
);


const MyPlants = ({ navigation, plants }) => {
  return (
    <View style={ styles.mainView }>
      <LabelText size='LARGE' styleOptions={{ 
          paddingHorizontal: PADDING.MEDIUM, 
          paddingTop: PADDING.LARGE,
          paddingBottom: PADDING.MEDSMALL,
          borderBottomColor: COLORS.GRAY.MEDIUM,
          borderBottomWidth: 1,
        }}>Manage Your Plants</LabelText>
      <SwipeListView
        style={{ width: '100%' }}
        data={plants}
        renderHiddenItem={renderHiddenItem}
        renderItem={PlantCard(navigation)}
        rightOpenValue={-75}
        keyExtractor={item => String(item.id)}
      />
      <View style={{ padding: 10 }}>
        <Button 
          color={COLORS.GREEN.BRIGHT}
          title="Add another plant"
          onPress={() => navigation.navigate('Add Plant', { plant: null })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView,
  flexRow,
  title: {
    color: COLORS.GREEN.BRIGHT,
    fontSize: 32,
  },
   rowBack: {
    alignItems: 'center',
    backgroundColor: COLORS.GRAY.DARK,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    margin: 8,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: COLORS.RED.BRIGHT,
    right: 0,
  },
});


const mapStateToProps = (state) => ({
  plants: allPlantsSelector(state)
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MyPlants);
