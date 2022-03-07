import React from 'react';
import {FlatList} from 'react-native';
import propTypes from 'prop-types';
import SubscriberListItem from './UserListItem';

const UserList = ({navigation, userArray}) => {
  return (
    <FlatList
      data={userArray}
      keyExtractor={(item) => item.user_id.toString()}
      renderItem={({item}) => (
        <SubscriberListItem subscriber={item} navigation={navigation} />
      )}
      ListFooterComponent={() => {
        return null;
      }}
    />
  );
};

UserList.propTypes = {
  userArray: propTypes.array,
};

export default UserList;
