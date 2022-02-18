import React, {useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {FlatList, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia, useTag} from '../hooks/ApiHooks';
import ListItem from '../components/SingleListItem';
import {appId} from '../utils/Variables';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();
  const {getTagsForFile} = useTag();

  const fetchFavourites = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const itemList = await getFavourites(token);
      itemList.forEach(getTagForItem);
    } catch (error) {
      console.error('get favourites error', error);
    }
  };

  const getTagForItem = async (item) => {
    const file_id = item.file_id;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const tags = await getTagsForFile(file_id, token);
      tags.forEach(getPostsWithTag);
    } catch (error) {
      console.error('get favourite items error', error);
    }
  };

  const getPostsWithTag = async (item) => {
    if (item.tag === appId) {
      const token = await AsyncStorage.getItem('userToken');
      const post = await getSingleMedia(item.file_id, token);
      itemsList.push(post);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={itemsList}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => (
          <ListItem
            navigation={navigation}
            singleMedia={item}
            myFilesOnly={false}
          />
        )}
      />
    </SafeAreaView>
  );
};

SavedPosts.propTypes = {
  navigation: PropTypes.object,
};

export default SavedPosts;
