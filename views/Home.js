import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Button, Text, Tile} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

import {getFonts} from '../utils/Utils';
import ListAroundYou from '../components/ListAroundYou';
import ListByPetType from '../components/ListByPetType';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';

const Home = ({navigation}) => {
  const {setSelectedPetType} = useContext(MainContext);
  const {mediaArray} = useMedia();
  const insets = useSafeAreaInsets();
  const animation = React.createRef();
  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  console.log('mediaArray', mediaArray.length);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{paddingBottom: insets.bottom}}>
          <Text style={styles.titles} h4>
            Welcome to Pawsitive!
          </Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignContent: 'space-between',
              }}
              onPress={() => {
                navigation.navigate('Map');
              }}
            >
              <LottieView
                ref={animation}
                source={require('../assets/map-open-animation.json')}
                style={{
                  width: '80%',
                  aspectRatio: 1,
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                }}
                autoPlay={true}
                loop={true}
              ></LottieView>
              <Text
                style={[styles.titles, {fontSize: 18, alignSelf: 'center'}]}
              >
                Open map
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'column',
                alignContent: 'space-between',
              }}
              onPress={() => {
                navigation.navigate('Listing');
                setSelectedPetType('all');
              }}
            >
              <LottieView
                ref={animation}
                source={require('../assets/animal-animation.json')}
                style={{
                  width: '80%',
                  aspectRatio: 1,
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                }}
                autoPlay={true}
                loop={true}
              ></LottieView>
              <Text
                style={[styles.titles, {fontSize: 18, alignSelf: 'center'}]}
              >
                All listings
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.titles} h4>
            Listings around you
          </Text>
          {mediaArray.length > 0 ? (
            <ListAroundYou navigation={navigation} mediaArray={mediaArray} />
          ) : (
            <Tile
              title="No posts around you"
              featured
              activeOpacity={1}
              width={300}
              height={250}
            />
          )}

          <Text style={styles.titles} h4>
            Discover by type of pets
          </Text>
          <ListByPetType navigation={navigation} />
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
