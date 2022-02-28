import React, {useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia, useTag} from '../hooks/ApiHooks';
import {appId} from '../utils/Variables';
import SingleListItem from '../components/SingleListItem';
import {MainContext} from '../contexts/MainContext';
import {LinearGradient} from 'expo-linear-gradient';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();
  const {getTagsForFile} = useTag();
  const {update} = useContext(MainContext);

  const fetchFavourites = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const favouritesList = await getFavourites(token);
    const favouritesWithTag = await favouritesList.filter(
      filterFavouritesByTag
    );
    console.log('tags', favouritesWithTag);

    try {
      const mediaItems = await Promise.all(
        favouritesWithTag.map(async (tag) => {
          try {
            return await getSingleMedia(tag.file_id, token);
          } catch (error) {
            console.error('get single media file error');
          }
        })
      );
      console.log('mediaItems', mediaItems);
      setItemsList(mediaItems);
    } catch (error) {
      console.error('get favourites error', error);
    }
  };

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
  }, [update]);

  return (
    <SafeAreaView>

      <View
        style={styles.listContainer}
      >
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
