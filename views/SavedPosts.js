import React, {useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {FlatList, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia, useTag} from '../hooks/ApiHooks';
import ListItem from '../components/SingleListItem';
import {appId} from '../utils/Variables';
import SingleListItem from '../components/SingleListItem';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();
  const {getTagsForFile} = useTag();

  const fetchFavourites = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const favouritesList = await getFavourites(token);
    const favouritesWithTag = favouritesList.filter(filterFavouritesByTag);
    console.log('tags', favouritesWithTag);

    try {
      const mediaItems = await Promise.all(
        favouritesWithTag.map(async (tag) => {
          try {
            return await getSingleMedia(tag.file_id, token);
          } catch (error) {
            console.error('get single media file error', error);
          }
        })
      );
      console.log('mediaItems', mediaItems);
      setItemsList(mediaItems);
    } catch (error) {
      console.error('get favourites error', error);
    }
  };
  /*
  const fetchFavourites = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const itemList = await getFavourites(token);
      //itemList.forEach(getTagForItem);
      const tagList= itemList.filter(async item=>{
        const file_id = item.file_id;
        try {
          const token = await AsyncStorage.getItem('userToken');
          const tags = await getTagsForFile(file_id, token);
          tags.forEach(getPostsWithTag);
        } catch (error) {
          console.error('get favourites error', error);
        }
      });
      setItemsList([...itemsList, tagList]);
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
      console.error('get favourites error', error);
    }
    setItemsList(list);
  };

  const getPostsWithTag = async (item) => {
    const tagRoot = item.tag.split('_')[0];
    if (tagRoot === appId) {
      const token = await AsyncStorage.getItem('userToken');
      const post = await getSingleMedia(item.file_id, token);
      const list = itemsList.slice();
      list.push(post);
    }
  };

  const getTagForItem = async (item) => {
    const file_id = item.file_id;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const tags = await getTagsForFile(file_id, token);
      //tags.forEach(getPostsWithTag);
      console.log('tags', tags);
      tags.forEach(getPostsWithTag);
    } catch (error) {
      console.error('get favourite items error', error);
    }
    setItemsList([...itemsList, list]);
  };

  const getPostsWithTag = async (item) => {
    if (item.tag === appId) {
      const token = await AsyncStorage.getItem('userToken');
      const post = await getSingleMedia(item.file_id, token);
      list.push(post);
    }
  };*/

  const filterFavouritesByTag = async (item) => {
    const fileId = item.file_id;
    const token = await AsyncStorage.getItem('userToken');
    const tags = await getTagsForFile(fileId, token);

    return tags.filter((tag) => {
      const tagRoot = tag.tag.split('_')[0];
      if (tagRoot === appId) {
        return tag;
      }
    });
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
          <SingleListItem navigation={navigation} singleMedia={item} />
        )}
        ListFooterComponent={() => {
          return null;
        }}
      />
    </SafeAreaView>
  );
};

SavedPosts.propTypes = {
  navigation: PropTypes.object,
};

export default SavedPosts;
