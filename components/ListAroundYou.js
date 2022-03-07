import React, {useContext, useRef, useState, useEffect} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet, View} from 'react-native';
import {getFonts} from '../utils/Utils';
import {Tile, Text} from 'react-native-elements';
import LottieView from 'lottie-react-native';
import PlaceholderImage from './PlaceholderImage';

import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const ListAroundYou = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inRangeLoading, setInRangeLoading] = useState(true);

  const refOwner = useRef(null);
  const refSitter = useRef(null);
  const {postsInRange, update, petOwnerMarkers, petSitterMarkers} =
    useContext(MainContext);
  const animation = React.createRef();
  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  const getFileIdsOwner = [...petOwnerMarkers].map(
    (post, index) => [...petOwnerMarkers][index].postFileId
  );
  const getFileIdsSitter = [...petSitterMarkers].map(
    (post, index) => [...petSitterMarkers][index].postFileId
  );

  const allPetSitters = [...postsInRange].filter((item) =>
    getFileIdsSitter.includes(item.whole.file_id)
  );
  const allPetOwners = [...postsInRange].filter((item) =>
    getFileIdsOwner.includes(item.whole.file_id)
  );
  //
  // console.log('pet sitters in range', allPetSitters);
  // console.log('pet owners in range', allPetOwners);

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

  const renderItemOwner = ({item, index}) => (
    <Tile
      imageSrc={{uri: uploadsUrl + allPetOwners[index].thumbnails.w640}}
      title={allPetOwners[index].title}
      titleStyle={styles.title}
      caption={`${allPetOwners[index].distanceFromCurrent} km away`}
      captionStyle={styles.caption}
      overlayContainerStyle={styles.overlayContainer}
      imageContainerStyle={{borderRadius: 20}}
      featured
      activeOpacity={1}
      width={300}
      height={250}
      onPress={() => {
        navigation.navigate('Single', {file: allPetOwners[index].whole});
      }}
    />
  );

  const renderItemSitter = ({item, index}) => (
    <Tile
      imageSrc={{uri: uploadsUrl + allPetSitters[index].thumbnails.w640}}
      title={allPetSitters[index].title}
      titleStyle={styles.title}
      caption={`${allPetSitters[index].distanceFromCurrent} km away`}
      captionStyle={styles.caption}
      overlayContainerStyle={styles.overlayContainer}
      imageContainerStyle={{borderRadius: 20}}
      featured
      activeOpacity={1}
      width={300}
      height={250}
      onPress={() => {
        navigation.navigate('Single', {file: allPetSitters[index].whole});
      }}
    />
  );

  if (inRangeLoading) {
    return (
      <View style={{marginLeft: 20}}>
        <Text style={styles.loadingTitle} h4>
          Loading posts around you
        </Text>
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
          {allPetOwners.length > 0 ? (
            <>
              <Text style={styles.titles} h4>
                Pets around you
              </Text>
              <Carousel
                activeSlideAlignment="start"
                containerCustomStyle={{marginHorizontal: 20}}
                renderItem={renderItemOwner}
                data={allPetOwners}
                ref={refOwner}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
              <Pagination
                dotsLength={allPetOwners.length}
                activeDotIndex={activeIndex}
                carouselRef={refOwner}
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
          ) : (
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
          )}

          {allPetSitters.length > 0 ? (
            <>
              <Text style={styles.titles} h4>
                Pet sitters around you
              </Text>
              <Carousel
                activeSlideAlignment="start"
                containerCustomStyle={{marginHorizontal: 20}}
                renderItem={renderItemSitter}
                data={allPetSitters}
                ref={refSitter}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
              <Pagination
                dotsLength={allPetSitters.length}
                activeDotIndex={activeIndex}
                carouselRef={refSitter}
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
          ) : (
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
          )}
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
  titles: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  loadingTitle: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginBottom: 20,
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
