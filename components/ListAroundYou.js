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
import {getDistance, isPointWithinRadius} from 'geolib';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import PlaceholderImage from './PlaceholderImage';
import {MainContext} from '../contexts/MainContext';

// @SAM: in MainContext, we have userCurrentLocation and postLocation which maybe useful here

const ListAroundYou = ({navigation, mediaArray}) => {
  const [postsInRange, setPostsInRange] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const {currentUserLocation, setCurrentUserLocation} = useContext(MainContext);

  getFonts();

  const loadPostsInRange = async () => {
    await mediaArray?.map((mediaPost) => {
      const desc = JSON.parse(mediaPost.description);
      const result = isPointWithinRadius(
        {
          latitude: desc.coords.latitude,
          longitude: desc.coords.longitude,
        },
        {
          latitude: currentUserLocation.latitude,
          longitude: currentUserLocation.longitude,
        },
        10000
      );
      const distance = getDistance(
        {
          latitude: currentUserLocation.latitude,
          longitude: currentUserLocation.longitude,
        },
        {
          latitude: desc.coords.latitude,
          longitude: desc.coords.longitude,
        },
        100
      );

      // console.log(
      //   'mediaPost title: ',
      //   mediaPost.title,
      //   'distance: ',
      //   distance,
      //   'is withing radius 10km ',
      //   result
      // );
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

  useEffect(async () => {
    if (checkLocationPermission()) {
      setCurrentUserLocation(await getUserLocation());
      // console.log('USER LOCATION', currentUserLocation);
    } else {
      askPermission();
    }
  }, []);

  // TODO figure out how to get mediaArray load first before rendering anything
  useEffect(() => {
    loadPostsInRange();
    // console.log('posts loaded in range', postsInRange);
  }, [currentUserLocation]);

  const renderItem = ({item, index}) => (
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
          renderItem={renderItem}
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
