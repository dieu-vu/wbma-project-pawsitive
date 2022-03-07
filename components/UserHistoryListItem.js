import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl, colors} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';

// TODO: change description for all file in listing
const UserHistoryListItem = ({file}) => {
  return (
    <ListItem
      bottomDivider
      style={styles.listItem}
      Component={TouchableOpacity}
      linearGradientProps={{
        colors: ['white', colors.headerGreen],
        start: {x: 0.1, y: 0.6},
        end: {x: 0, y: 0.2},
      }}
      containerStyle={{borderColor: colors.darkestGreen, borderWidth: 0.5}}
      ViewComponent={LinearGradient}
    >
      <Avatar
        size="large"
        rounded={true}
        source={{
          uri: uploadsUrl + file.thumbnails.w160,
        }}
      />
      <ListItem.Content style={styles.itemContent}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <ListItem.Title numberOfLines={2} style={[styles.title]}>
            {file.title}
          </ListItem.Title>
          <ListItem.Title numberOfLines={2} style={styles.rating}>
            Average ratings:{' '}
            {file.average_rating
              ? file.average_rating.toString()
              : 'Unavailable'}
          </ListItem.Title>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#8DD35E',
    marginBottom: 5,
    marginTop: 5,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    padding: 10,
  },
  rating: {fontFamily: 'Montserrat-Regular', fontSize: 16, padding: 10},
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

UserHistoryListItem.propTypes = {
  file: PropTypes.object.isRequired,
};

export default UserHistoryListItem;
