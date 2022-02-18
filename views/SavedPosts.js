import React, {useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {FlatList, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItemAroundYou';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();

  const fetchFavourites = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const itemList = await getFavourites(token);
      console.log('favourites', itemList);
      itemList.forEach(getItems);
    } catch (error) {
      console.error('get favourites error', error);
    }
  };

  const getItems = async (item) => {
    const file_id = item.file_id;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const post = await getSingleMedia(file_id, token);
      console.log('favourites list', post);
      itemsList.push(post);
    } catch (error) {
      console.error('get favourite items error', error);
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
