import React, {useCallback, useContext, useRef, useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Dimensions, StyleSheet} from 'react-native';
import {getFonts} from '../utils/Utils';
import {Tile} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';

// Array that shows in carousel as different pet types
const PetTypesArray = [
  {
    title: 'Dog',
    uri: require('../assets/dogSmiling1.jpg'),
  },
  {
    title: 'Cat',
    uri: require('../assets/kitten.jpg'),
  },
  {
    title: 'Bird',
    uri: require('../assets/birds.png'),
  },
  {
    title: 'Other',
    uri: require('../assets/horseFace.png'),
  },
];

const ListByPetType = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const {setSelectedPetType} = useContext(MainContext);

  getFonts();

  const renderItem = useCallback(
    ({item, index}) => (
      <Tile
        imageSrc={PetTypesArray[index].uri}
        title={PetTypesArray[index].title}
        titleStyle={styles.title}
        imageContainerStyle={{borderRadius: 20}}
        featured
        activeOpacity={1}
        width={175}
        height={200}
        onPress={() => {
          setSelectedPetType(item.title.toLowerCase());
          props.navigation.navigate('Listing');
        }}
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
        data={PetTypesArray}
        ref={ref}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={175}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={PetTypesArray.length}
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

ListByPetType.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default ListByPetType;
