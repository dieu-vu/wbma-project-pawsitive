import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';

const SingleListItem = ({navigation, singleMedia}) => {
  return (
    <ListItem
      bottomDivider
      style={styles.listItem}
      Component={TouchableOpacity}
      linearGradientProps={{
        colors: ['#8DD35E', '#425E20'],
        start: {x: 0.1, y: 0.3},
        end: {x: 0, y: 0.2},
      }}
      ViewComponent={LinearGradient}
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Avatar
        size="large"
        rounded={true}
        source={{
          uri: uploadsUrl + singleMedia.thumbnails.w160,
        }}
      />
      <ListItem.Content>
        <ListItem.Title numberOfLines={1} h4>
          {singleMedia.title}
        </ListItem.Title>
        <ListItem.Subtitle>{singleMedia.description}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#8DD35E',
    marginBottom: 10,
  },
});

SingleListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default SingleListItem;
