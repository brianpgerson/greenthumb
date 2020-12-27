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
import { Icon } from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view';

import { mainViewFlex, flexRow, COLORS } from '../common/common-styles';
import { createTwoButtonAlert } from '../common/alert';
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
    retrieveAndReloadPlants();
  } catch (error) {
    createTwoButtonAlert('Error', 'There was an error deleting this plant! Try again later.');
  }
} 

const PlantCard = (navigation) => ({ item: plant }) => (
  <View style={styles.item}>
    <View>
      <Text style={styles.title}>{plant.name}</Text>
      <View style={styles.flexRow}>
        <Text style={{ color: COLORS.GREEN.BRIGHT }}>{plant.type} - </Text>
        <Text style={{ color: COLORS.GREEN.BRIGHT }}>{generateFormattedRule(plant.schedule)}</Text>
      </View>
    </View>
    <View>
      <Icon name="edit" 
            color={COLORS.GREEN.BRIGHT} 
            containerStyle={{ backgroundColor: COLORS.GREEN.DARK, padding: 6, borderRadius: 20 }} 
            onPress={() => navigation.navigate('Add Plant', { plant })} />
    </View>
  </View>
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
    <View style={ styles.mainViewFlex }>
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
  mainViewFlex,
  flexRow,
  item: {
    backgroundColor: COLORS.GRAY.DARKEST,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
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
