import React from 'react';
import {FlatList} from 'react-native';
import propTypes from 'prop-types';
import SubscriberListItem from './UserListItem';

const List = ({userArray}) => {
  return (
    <FlatList
      data={userArray}
      keyExtractor={(item) => item.user_id.toString()}
      renderItem={({item}) => <SubscriberListItem subscriber={item} />}
      ListFooterComponent={() => {
        return null;
      }}
    />
  );
};

List.propTypes = {
  userArray: propTypes.array,
};

export default List;
