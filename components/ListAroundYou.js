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
import {cos} from 'react-native-reanimated';

const initialLoad = async (currentUserLocation, setCurrentUserLocation) => {
  console.log('Load initialload');
  const hasPermission = await checkLocationPermission();
  // console.log('has Permission: ', hasPermission);
  if (!hasPermission) {
    await askPermission();
  }
  const userLocation = await getUserLocation();
  // console.log('user loc ', userLocation);
  setCurrentUserLocation(userLocation);
  // console.log('USER LOCATION', currentUserLocation);
  console.log('Init succeeds');
};

const loadPostsInRange = (mediaArray, currentUserLocation, setPostsInRange) => {
  mediaArray?.map((mediaPost) => {
    const desc = JSON.parse(mediaPost.description);
    const result = isPointWithinRadius(
      {
        latitude: desc.coords.latitude,
        longitude: desc.coords.longitude,
      },
      currentUserLocation,
      10000
    );
    if (result) {
      setPostsInRange((oldPost) => [
        ...oldPost,
        {
          whole: mediaPost,
          title: mediaPost.title,
          thumbnails: mediaPost.thumbnails,
          coordinates: {
            latitude: desc.coords.latitude,
            longitude: desc.coords.longitude,
          },
        },
      ]);
    }
  });
};

const ListAroundYou = async ({navigation, mediaArray}) => {
  const [postsInRange, setPostsInRange] = useState([]);
  const {currentUserLocation, setCurrentUserLocation} = useContext(MainContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  console.log('Load listaroundyou');
  // initialLoad(currentUserLocation, setCurrentUserLocation);
  getFonts();
  console.log('getFonts succeeds');
  const newPostsInRange = [];
  mediaArray?.map((mediaPost) => {
    const desc = JSON.parse(mediaPost.description);
    const result = isPointWithinRadius(
      {
        latitude: desc.coords.latitude,
        longitude: desc.coords.longitude,
      },
      currentUserLocation,
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
  if (newPostsInRange.length > 0) {
    await setPostsInRange(newPostsInRange);
  }
  // loadPostsInRange(mediaArray, currentUserLocation, setPostsInRange);
  // console.log('loadPostsInRange succeeds');
  console.log('posts loaded in range', postsInRange.length);
  // TODO figure out how to get mediaArray load first before rendering anything
  // useEffect(() => {
  //   loadPostsInRange(mediaArray, currentUserLocation, setPostsInRange);
  //   console.log('posts loaded in range', postsInRange.length);
  // }, [currentUserLocation]);

  const itemToRender = ({item, index}) => (
    <Tile
      imageSrc={{uri: uploadsUrl + postsInRange[index].thumbnails.w640}}
      title={postsInRange[index].title}
      titleStyle={styles.title}
      imageContainerStyle={{borderRadius: 20}}
      featured
      activeOpacity={1}
      width={300}
      height={250}
      onPress={() => {
        navigation.navigate('Single', {file: postsInRange[index].whole});
      }}
    />
  );

  if (postsInRange.length === 0) {
    return <PlaceholderImage />;
  } else {
    return (
      <>
        <Carousel
          activeSlideAlignment="start"
          containerCustomStyle={{marginHorizontal: 20}}
          renderItem={itemToRender}
          data={postsInRange}
          ref={ref}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={postsInRange.length}
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
