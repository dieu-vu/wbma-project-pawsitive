import React, {useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia, useTag} from '../hooks/ApiHooks';
import {appId} from '../utils/Variables';
import SingleListItem from '../components/SingleListItem';
import {MainContext} from '../contexts/MainContext';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();
  const {getTagsForFile} = useTag();
  const {update} = useContext(MainContext);

  const fetchFavourites = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const favouritesList = await getFavourites(token);
    if (favouritesList) {
      const favouritesWithTag = favouritesList.filter(filterFavouritesByTag);

      console.log('favouritesWithTag', favouritesWithTag);
      if (favouritesWithTag) {
        try {
          const mediaItems = await Promise.all(
            favouritesWithTag.map(async (tag) => {
              if (tag != undefined) {
                try {
                  const response = await getSingleMedia(tag.file_id, token);
                  return response;
                } catch (error) {
                  console.error('get single media file error');
                }
              }
            })
          );
          console.log('mediaItems', mediaItems);
          setItemsList(mediaItems);
        } catch (error) {
          console.error('get favourites error', error);
        }
      }
    }
  };

  const filterFavouritesByTag = async (item) => {
    const fileId = item.file_id;
    const token = await AsyncStorage.getItem('userToken');
    const tags = await getTagsForFile(fileId, token);

    let myAppFile = false;

    tags.filter((tag) => {
      const tagRoot = tag.tag.split('_')[0];
      myAppFile = tagRoot === appId;
    });
    console.log('MY APP FILE', item.file_id, myAppFile);
    return myAppFile;
  };

  useEffect(() => {
    fetchFavourites();
  }, [update]);

  return (
    <SafeAreaView>
      <View style={styles.listContainer}>
        <FlatList
          style={styles.flatList}
          data={itemsList}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({item}) => (
            <SingleListItem
              navigation={navigation}
              singleMedia={item}
              savedPosts={true}
            />
          )}
          ListFooterComponent={() => {
            return null;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

SavedPosts.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  listContainer: {
    alignSelf: 'center',
    transform: [{scaleX: 0.95}],
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 6,
    marginHorizontal: 5,
    marginTop: 3,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#8DD35E',
    borderRadius: 12,
    bottom: -15,
  },
});

export default SavedPosts;
