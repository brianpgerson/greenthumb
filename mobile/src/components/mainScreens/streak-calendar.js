import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as R from 'ramda';

import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import { calendarListOfWateringsSelector, dueWateringsSelector } from '../../selectors/plantSelectors';
import { mainViewFlex, headerText, COLORS } from '../common/common-styles';
import WateringCell from '../watering-cell';
import WateringGroup from '../watering-group';
import PendingWateringModal from '../pending-watering-modal';
import PreviousWateringModal from '../previous-watering-modal';
import { toCalendarDay, getToday } from '../../utils/generalUtils';

const getWidthBasedOn = (numCols) => `${Math.ceil((100/3) * numCols)}%`;

const renderPreviousWatering = (watering) => {
  if (Array.isArray(watering)) {
    const key = R.pipe(
      R.map(R.props(['id', 'date'])),
      R.flatten,
      R.join('|')
    )(watering)
    return (<WateringGroup key={key} waterings={watering}/>)
  }

  return <WateringCell key={watering.id} watering={watering} readOnly={true} />;
}

const renderRow = (row, idx) => (
  <View 
    key={idx}
    style={{ 
    ...styles.wateringsSubContainer, 
    marginVertical: 10,
    width: getWidthBasedOn(row.length),
  }}>
    {row.map(w => (<WateringCell key={w.id} watering={w} readOnly={false} />))}
  </View>
)

const renderTodayWaterings = R.pipe(R.splitEvery(3), R.addIndex(R.map)(renderRow))

const getShortDateString = (dateString) => {
  const [ _, m, d ] = dateString.split('-');
  return `${m}/${d}`
}

const TodayView = ({ waterings, date }) => {
  return (
    <View style={styles.todayView}>
      <Text style={{ ...styles.dateText, fontWeight: 'bold' }}>Today: {date}</Text>
      {R.isEmpty(waterings) ? 
      (<View style={{ padding: 50, height: 140 }}>
        <Text style={styles.headerText}>
          No thirsty plants today!
        </Text>
      </View>
      ) : renderTodayWaterings(waterings)}
    </View>
  )}

const PastWaterings = ({ waterings }) => {
  const individualWaterings = waterings.slice(0,3);
  const row = waterings.slice(0, 2);
  
  if (waterings.length > 2) {
    const group = waterings.slice(2);
    if (group.length === 1)  {
      row.push(group[0])
    } else {
      row.push(group);
    }
  }

  return (
  <View style={{ 
    ...styles.wateringsSubContainer,
     width: getWidthBasedOn(row.length),
  }}>
    {row.map(w => renderPreviousWatering(w))}
  </View>
)}

const renderItems = ({ item: { date, waterings, isToday } }) => {
  return isToday ? (
    <TodayView waterings={waterings} date={date} />
  ) : (
    <View style={styles.calendarBox}>
      <Text style={styles.dateText}>{date}</Text>
      <PastWaterings waterings={waterings} />
    </View>
  )
}

const StreakView = ({ navigation, previousWaterings, dueWaterings }) => {
  const data = [
    { waterings: dueWaterings, date: toCalendarDay(getToday()), isToday: true, }, 
    ...previousWaterings 
  ];
  
  return (
    <View style={ styles.mainViewFlex }>
      <PreviousWateringModal navigation={navigation} />
      <PendingWateringModal />
      <FlatList style={{ width: '90%' }} 
                renderItem={renderItems} 
                data={data} 
                keyExtractor={R.prop('date')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex,
  headerText,
  todayView: {
    paddingTop: 30,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: COLORS.GRAY.DARKEST,
  },
  calendarBox: {
    backgroundColor: COLORS.GRAY.DARKEST,
    width: '100%',
    height: 160,
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 40, 
    paddingBottom: 20,
  },
  wateringsSubContainer: {
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dateText: {
    color: COLORS.GREEN.BRIGHT,
    right: 5,
    top: 5,
    position: 'absolute',
  },
  separator: {
    height: 10,
    backgroundColor: "#000",
  }
});

const mapStateToProps = (state) => ({
  previousWaterings: calendarListOfWateringsSelector(state),
  dueWaterings: dueWateringsSelector(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(StreakView);