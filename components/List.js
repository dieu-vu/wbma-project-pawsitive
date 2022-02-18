import React from 'react';
import {FlatList} from 'react-native';
import propTypes from 'prop-types';
import {useMedia} from '../hooks/ApiHooks';
import SingleListItem from './SingleListItem';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();
  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <SingleListItem singleMedia={item} navigation={navigation} />
      )}
      ListFooterComponent={() => {
        return null;
      }}
    />
  );
};

List.propTypes = {
  navigation: propTypes.object,
};

export default List;
