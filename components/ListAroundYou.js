import React, {useContext, useRef, useState, useEffect} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {getFonts} from '../utils/Utils';
import {Tile} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import PlaceholderImage from './PlaceholderImage';

import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const ListAroundYou = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inRangeLoading, setInRangeLoading] = useState(true);

  const ref = useRef(null);
  const {postsInRange, update} = useContext(MainContext);
  const animation = React.createRef();
  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  // Wait up to 3 seconds, if no posts around, show message
  useEffect(() => {
    setInRangeLoading(true);
    const timer = setTimeout(() => {
      setInRangeLoading(false);
      // console.log('IN RANGE LOADING', inRangeLoading);
      // console.log('length in Range', postsInRange.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [update, postsInRange]);

  const renderItem = ({item, index}) => (
    <Tile
      imageSrc={{uri: uploadsUrl + postsInRange[index].thumbnails.w640}}
      title={postsInRange[index].title}
      titleStyle={styles.title}
      caption={`${postsInRange[index].distanceFromCurrent} km away`}
      captionStyle={styles.caption}
      overlayContainerStyle={styles.overlayContainer}
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

  if (inRangeLoading) {
    return (
      <View style={{marginLeft: 20}}>
        <PlaceholderImage
          style={{
            width: 300,
            height: undefined,
            borderRadius: 20,
            backgroundColor: 'white',
          }}
        />
      </View>
    );
  } else {
    if (postsInRange.length === 0 && inRangeLoading === false) {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <LottieView
            ref={animation}
            source={require('../assets/cat-popping-animation.json')}
            style={{
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
              fontFamily: 'Montserrat-Regular',
              fontSize: 18,
              alignSelf: 'center',
            }}
          >
            No posts around you
          </Text>
        </View>
      );
    } else if (postsInRange.length > 0) {
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
  }
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    transform: [{translateY: 40}],
  },
  caption: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    transform: [{translateY: 40}],
  },
  overlayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0, 0.1)',
    borderRadius: 20,
  },
});

ListAroundYou.propTypes = {
  navigation: PropTypes.object,
};

export default ListAroundYou;
