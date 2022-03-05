import React from 'react';
import {FlatList} from 'react-native';
import propTypes from 'prop-types';
import SubscriberListItem from './SubcriberListItem';

const List = ({navigation, userArray}) => {
  return (
    <FlatList
      data={userArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <SubscriberListItem singleMedia={item} navigation={navigation} />
      )}
      ListFooterComponent={() => {
        return null;
      }}
    />
  );
};

List.propTypes = {
  navigation: propTypes.object,
  userArray: propTypes.object,
};

export default List;
