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

import { allWateringsSelector, overdueWateringsSelector } from '../../selectors/plantSelectors';
import { mainViewFlex, COLORS } from '../common/common-styles';
import { isBefore } from '../../utils/generalUtils';

const FlatListItemSeparator = ({ leadingItem }) => {
  const continuations = leadingItem.waterings.filter(w => isBefore(w.startDate, w.date))
  return (
    <View style={styles.separator}>
      {renderWaterings(continuations, { ignorePadding: true, ignoreText: true })}
    </View>
  );
}

const renderWaterings = (waterings, options = {}) => {
  if (waterings.length === 0) {
    return null
  }

  const { date } = waterings[0];
  const byColIdx = R.indexBy(R.prop('columnIdx'), waterings);

  const grouped = waterings.filter(R.propSatisfies(R.lt(2), 'columnIdx'))
  const columns = [
    byColIdx[0] || { blank: true, date, columnIdx: 0 },
    byColIdx[1] || { blank: true, date, columnIdx: 1 },
    byColIdx[2] || { blank: true, date, columnIdx: 2 },
    grouped.length > 0 ? grouped : { blank: true, date, columnIdx: 3 },
  ]

  return (
  <View style={styles.wateringsSubContainer}>
    {columns.map(w => renderWatering(w, options))}
  </View>
)}

const WateringGroup = ({ waterings }) => (
  <View style={{ 
    width: '25%',
    paddingTop: 40,
    paddingBottom:  20,
  }}>
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={COLORS.GREEN.BRIGHT}
      style={{
        backgroundColor: COLORS.GREEN.BRIGHT,
        width: '100%',
        height: '100%',
        borderRadius: 5,
      }}
      onPress={() => alert('Pressed watering: ' + JSON.stringify(waterings, null, 2))}>
      <Text style={styles.entryText}>{waterings.length} more...</Text>
    </TouchableHighlight>
  </View> 
)

const BlankWatering = () => (<View style={{ width: '30%', marginRight: 10 }} />)

const renderWatering = (watering, { ignorePadding, ignoreText }) => {
  if (watering.blank) {
    return (<BlankWatering key={`${watering.date}|${watering.columnIdx}`} />)
  }

  if (Array.isArray(watering)) {
    const key = R.pipe(
      R.map(R.props(['id', 'date'])),
      R.flatten,
      R.join('|')
    )(watering)
    return (<WateringGroup key={key} waterings={watering} />)
  }

  const hitsTopEdge = ignorePadding || 
    (!watering.forceStartNewColumn && isBefore(watering.date, watering.endDate))
  const hitsBottomEdge = ignorePadding || isBefore(watering.startDate, watering.date)

  const shouldIgnoreText = ignoreText || (watering.date !== watering.endDate && !watering.forceStartNewColumn);
  
  const name = shouldIgnoreText ? null : watering.name;
  const type = shouldIgnoreText ? null : watering.type;
  return (
    <View key={watering.id} style={{ 
      width: '30%',
      paddingTop: hitsTopEdge ? 0 : 20,
      paddingBottom: hitsBottomEdge ? 0 : 20,
      marginRight: 10,
    }}>
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={COLORS.GREEN.BRIGHT}
        style={{
          backgroundColor: COLORS.GREEN.BRIGHT,
          width: '100%',
          height: '100%',
          borderTopRightRadius: hitsTopEdge ? 0 : 5,
          borderTopLeftRadius: hitsTopEdge ? 0 : 5,
          borderBottomRightRadius: hitsBottomEdge ? 0 : 5,
          borderBottomLeftRadius: hitsBottomEdge ? 0 : 5,
        }}
        onPress={() => alert('Pressed watering: ' + JSON.stringify(watering, null, 2))}>
        <View>
          <Text style={styles.entryText}>{name}</Text>
          <Text numberOfLines={1} style={{ padding: 3 }}>{type}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const renderRow = (row) => (
  <View style={styles.todayRow}>
    {row.map(watering => {
      const { name, type, overdue } = watering;
      return (
        <TouchableHighlight 
          style={styles.wateringCell(overdue) }
          underlayColor={COLORS.GRAY.LIGHTEST}
          onPress={() => alert('Pressed watering: ' + JSON.stringify(watering, null, 2))}>
          <View>
            <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>{name}</Text>
            <Text numberOfLines={1} style={{ textAlign: 'center' }}>{type}</Text>
          </View>
        </TouchableHighlight>
      )}
    )}
  </View>
)

const renderTodayWaterings = (waterings) => {
  const rows = R.splitEvery(3, waterings);
  console.log(JSON.stringify(rows, null, 2))
  return rows.map(renderRow)
}

const getDateString = (date) => {
  const [ _, m, d ] = date.split('-');
  return `${m}/${d}`
}

const EmptyToday = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ 
      textAlign: 'center',
      color: COLORS.GRAY.LIGHTMED, 
      fontWeight: 'bold', 
      fontSize: 20 
    }}>
      No thirsty plants today!
    </Text>
  </View>
)

const TodayView = ({ waterings, overdue, date }) => {
  const allWaterings = [ ...overdue, ...waterings ];
  return (
    <View style={styles.todayView}>
      <Text style={{ ...styles.dateText, fontWeight: 'bold' }}>Today: {getDateString(date)}</Text>
      {R.isEmpty(allWaterings) ? (<EmptyToday />) : renderTodayWaterings(allWaterings)}
    </View>
  )}

const renderItemWithOverdue = (overdue) => ({ item: { date, waterings, isToday } }) => {
  return isToday ? (
    <TodayView waterings={waterings} overdue={overdue} date={date} />
  ) : (
    <View style={styles.calendarBox}>
      <Text style={styles.dateText}>{getDateString(date)}</Text>
      {renderWaterings(waterings)}
    </View>
  )
}


const Waterings = ({ waterings, overdue }) => {
  waterings[0].isToday = true;
  return (
    <View style={ styles.mainViewFlex }>
      <FlatList style={{ width: '90%' }} 
                renderItem={renderItemWithOverdue(overdue)} 
                data={waterings} 
                ItemSeparatorComponent={FlatListItemSeparator}
                keyExtractor={R.prop('date')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewFlex,
  entryText: {
    fontWeight: 'bold',
    paddingTop: 3,
    paddingHorizontal: 3,
  },
  todayView: {
    width: '100%',
    paddingTop: 30,
    backgroundColor: COLORS.GRAY.DARKEST,
    display: 'flex',
  },
  todayRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 100,
    width: '100%',
    marginVertical: 10,
  },
  wateringCell: (overdue) => ({
    backgroundColor: overdue ? COLORS.RED.BRIGHT : COLORS.GREEN.BRIGHT,
    height: 100,
    width: 100,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  calendarBox: {
    backgroundColor: COLORS.GRAY.DARKEST,
    display: 'flex',
    width: '100%',
    height: 150,
    paddingHorizontal: 20, 
  },
  wateringsSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%'
  },
  dateText: {
    color: COLORS.GREEN.BRIGHT,
    right: 5,
    top: 5,
    position: 'absolute',
  },
  separator: {
    height: 10,
    display: 'flex',
    paddingHorizontal: 20, 
    backgroundColor: "#000",
  }
});


const mapStateToProps = (state) => ({
  waterings: allWateringsSelector(state),
  overdue: overdueWateringsSelector(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Waterings);