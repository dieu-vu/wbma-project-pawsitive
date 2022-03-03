import React, {useContext, useRef, useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet} from 'react-native';
import {getFonts} from '../utils/Utils';
import {Tile} from 'react-native-elements';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import PlaceholderImage from './PlaceholderImage';
import {MainContext} from '../contexts/MainContext';

const ListAroundYou = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const {postsInRange} = useContext(MainContext);

  getFonts();

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
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  caption: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  overlayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 150,
    transform: [{translateY: 140}],
    backgroundColor: 'rgba(0,0,0, 0.2)',
  },
});

ListAroundYou.propTypes = {
  navigation: PropTypes.object,
  mediaArray: PropTypes.array,
};

export default ListAroundYou;
