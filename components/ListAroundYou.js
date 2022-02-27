import React, {useCallback, useRef, useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet} from 'react-native';
import {getFonts} from '../utils/Utils';
import {Tile} from 'react-native-elements';

// @SAM: in MainContext, we have userCurrentLocation and postLocation which maybe useful here
const fakeData = [
  {
    title: 'fluffy',
    uri: require('../assets/dogSmiling1.jpg'),
  },
  {
    title: 'fluffy2',
    uri: require('../assets/dogSmiling2.jpg'),
  },
  {
    title: 'fluffy3',
    uri: require('../assets/sheepGroup.jpg'),
  },
];

const ListAroundYou = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);

  getFonts();

  const renderItem = useCallback(
    ({item, index}) => (
      <Tile
        imageSrc={fakeData[index].uri}
        title={fakeData[index].title}
        titleStyle={styles.title}
        imageContainerStyle={{borderRadius: 20}}
        featured
        activeOpacity={1}
        width={300}
        height={250}
      />
    ),
    []
  );
  return (
    <>
      <Carousel
        activeSlideAlignment="start"
        containerCustomStyle={{marginHorizontal: 20}}
        renderItem={renderItem}
        data={fakeData}
        ref={ref}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={300}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={fakeData.length}
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

export default ListAroundYou;
