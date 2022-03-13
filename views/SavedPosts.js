import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
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
import LottieView from 'lottie-react-native';
import {Text} from 'react-native-elements';
import {getFonts} from '../utils/Utils';
import MainButton from '../components/MainButton';

const SavedPosts = ({navigation}) => {
  const [itemsList, setItemsList] = useState([]);
  const {getFavourites} = useFavourite();
  const {getSingleMedia} = useMedia();
  const {getTagsForFile} = useTag();
  const {update} = useContext(MainContext);
  const animation = React.createRef();

  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  // get favourites for the user, get media with the file_id
  const fetchFavourites = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const favouritesList = await getFavourites(token);
    if (favouritesList) {
      const favouritesWithTag = favouritesList.filter(filterFavouritesByTag);
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
          // console.log('mediaItems', mediaItems);
          setItemsList(mediaItems);
        } catch (error) {
          console.error('get favourites error', error);
        }
      }
    }
  };

  // filter out favourites saved in other apps
  const filterFavouritesByTag = async (item) => {
    const fileId = item.file_id;
    const token = await AsyncStorage.getItem('userToken');
    const tags = await getTagsForFile(fileId, token);

    let myAppFile = false;

    tags.filter((tag) => {
      const tagRoot = tag.tag.split('_')[0];
      myAppFile = tagRoot === appId;
    });
    // console.log('MY APP FILE', item.file_id, myAppFile);
    return myAppFile;
  };

  useEffect(() => {
    fetchFavourites();
  }, [update]);

  return (
    <SafeAreaView>
      <View style={styles.listContainer}>
        {itemsList.length === 0 ? (
          <View style={{flexDirection: 'column'}}>
            <LottieView
              ref={animation}
              source={require('../assets/cat-popping-animation.json')}
              style={{
                marginTop: 40,
                width: '80%',
                aspectRatio: 1,
                alignSelf: 'center',
                backgroundColor: 'transparent',
              }}
              autoPlay={true}
              loop={true}
            />
            <Text
              style={{
                marginTop: 60,
                height: 30,
                fontFamily: 'Montserrat-Regular',
                fontSize: 18,
                alignSelf: 'center',
              }}
            >
              No favourites yet
            </Text>
            <MainButton
              buttonStyle={styles.buttonStyle}
              title="Go to listings"
              titleStyle={styles.titleStyle}
              onPress={() => {
                navigation.navigate('Listing');
              }}
            />
          </View>
        ) : (
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
        )}
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
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 18,
  },
  buttonStyle: {
    width: Dimensions.get('window').width * 0.5,
    alignSelf: 'center',
    marginTop: 20,
    height: 40,
    backgroundColor: '#A9FC73',
    borderRadius: 35,
    marginBottom: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

export default SavedPosts;
