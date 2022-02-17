import React, { useCallback, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions } from "react-native";
import {Button, Text} from 'react-native-elements';
import {getFonts} from '../utils/Utils';
import Carousel, { Pagination } from "react-native-snap-carousel";
import ListItemAroundYou from '../components/ListItemAroundYou';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fakeData = [
  {
    title: 'fluffy',
    text: 'fluffy',
  },
  {
    title: 'fluffy2',
    text: 'fluffy2',
  },
  {
    title: 'fluffy3',
    text: 'fluffy3',
  },
];

const Home = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const insets = useSafeAreaInsets();

  getFonts();

  const renderItem = useCallback(({ item, index }) => (
    <ListItemAroundYou />
  ), []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{paddingBottom: insets.bottom}}>
          <Text style={styles.titles} h3>
            Welcome to Pawsitive!
          </Text>
          <Button
            title="Listings"
            onPress={() => {
              navigation.navigate('Listing');
            }}
            buttonStyle={styles.listings}
          />
          <Text style={styles.titles} h3>
            Listings around you
          </Text>
          <Carousel
            layout={'default'}
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
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: '#F4BB41',
            }}
            tappableDots={true}
            inactiveDotStyle={{
              backgroundColor: 'black',
              // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <Text style={styles.titles} h3>
            Discover by type of pets
          </Text>
          <Carousel
            layout={'default'}
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
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: '#F4BB41',
            }}
            tappableDots={true}
            inactiveDotStyle={{
              backgroundColor: 'black',
              // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listings: {
    marginTop: 20,
  },
  titles: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
});

Home.propTypes = {};

export default Home;
