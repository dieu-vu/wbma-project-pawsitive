import React, {useContext, useEffect, useRef, useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet} from 'react-native';
import {
  askPermission,
  checkLocationPermission,
  getFonts,
  getUserLocation,
} from '../utils/Utils';
import {Tile} from 'react-native-elements';
import {isPointWithinRadius} from 'geolib';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import PlaceholderImage from './PlaceholderImage';
import {MainContext} from '../contexts/MainContext';

const initialLoad = async (currentUserLocation, setCurrentUserLocation) => {
  // console.log('Load initialload');
  const hasPermission = await checkLocationPermission();
  // console.log('has Permission: ', hasPermission);
  if (!hasPermission) {
    await askPermission();
  }
  const userLocation = await getUserLocation();
  // console.log('user loc ', userLocation);
  setCurrentUserLocation(userLocation);
  // console.log('USER LOCATION', currentUserLocation);
  // console.log('Init succeeds');
  // console.log('Init LOCATION ', currentUserLocation);
};

const getPostsFromMediaArray = (mArray, userLocation) => {
  // console.log('Media array: ', mArray);
  const newPostsInRange = [];
  mArray?.map((mediaPost) => {
    const desc = JSON.parse(mediaPost.description);
    const result = isPointWithinRadius(
      {
        latitude: desc.coords.latitude,
        longitude: desc.coords.longitude,
      },
      userLocation,
      10000
    );
    if (result) {
      newPostsInRange.push({
        whole: mediaPost,
        title: mediaPost.title,
        thumbnails: mediaPost.thumbnails,
        coordinates: {
          latitude: desc.coords.latitude,
          longitude: desc.coords.longitude,
        },
      });
    }
  });
  // console.log('newPostsInRange inside func: ', newPostsInRange.length);
  return newPostsInRange;
};

const ListAroundYou = ({navigation, mediaArray}) => {
  // const [postsInRange, setPostsInRange] = useState([]);
  // console.log('Media Array in ListAroundYou: ', mediaArray.length);
  const {currentUserLocation, setCurrentUserLocation} = useContext(MainContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  // console.log('Load listaroundyou');
  getFonts();
  initialLoad(currentUserLocation, setCurrentUserLocation);
  let newPostsInRange = getPostsFromMediaArray(mediaArray, currentUserLocation);
  // console.log('newPostsInRange: ', newPostsInRange.length);
  // TODO figure out how to get mediaArray load first before rendering anything
  useEffect(() => {
    newPostsInRange = getPostsFromMediaArray(mediaArray, currentUserLocation);
    // console.log('posts loaded in range', newPostsInRange.length);
  }, [currentUserLocation]);

  const itemToRender = ({item, index}) => (
    <Tile
      imageSrc={{uri: uploadsUrl + newPostsInRange[index].thumbnails.w640}}
      title={newPostsInRange[index].title}
      titleStyle={styles.title}
      imageContainerStyle={{borderRadius: 20}}
      featured
      activeOpacity={1}
      width={300}
      height={250}
      onPress={() => {
        navigation.navigate('Single', {file: newPostsInRange[index].whole});
      }}
    />
  );

  if (newPostsInRange.length === 0) {
    return <PlaceholderImage />;
  } else {
    return (
      <>
        <Carousel
          activeSlideAlignment="start"
          containerCustomStyle={{marginHorizontal: 20}}
          renderItem={itemToRender}
          data={newPostsInRange}
          ref={ref}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={newPostsInRange.length}
          activeDotIndex={activeIndex}
          carouselRef={ref}
          dotStyle={{
            width: 15,
            height: 15,
            borderRadius: 50,
            marginHorizontal: 8,
            backgroundColor: '#425E20',
          }}
          tappableDots={true}
          inactiveDotStyle={{
            borderColor: '#425E20',
            borderWidth: 3,
            backgroundColor: 'white',
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </>
    );
  }
};

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
  },
});

ListAroundYou.propTypes = {
  navigation: PropTypes.object,
  mediaArray: PropTypes.array,
};

export default ListAroundYou;
