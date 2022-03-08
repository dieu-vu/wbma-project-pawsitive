import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import {getFonts} from '../utils/Utils';
import ListAroundYou from '../components/ListAroundYou';
import ListByPetType from '../components/ListByPetType';
import PlaceholderImage from '../components/PlaceholderImage';
import {MainContext} from '../contexts/MainContext';

const Home = ({navigation}) => {
  const {setSelectedPetType, postsInRange, update} = useContext(MainContext);
  const [inRangeLoading, setInRangeLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const animation = React.createRef();

  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  // Set 10-second timer for the elements to load into postsInRange
  useEffect(() => {
    setInRangeLoading(true);
    const timer = setTimeout(() => {
      setInRangeLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [update, postsInRange]);

  // When loading show "Loading posts",
  // if postsInRange is still empty then show "no posts around
  // and finally if it has atleast one element show it
  const listsAroundYou = () => {
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
        return <ListAroundYou navigation={navigation} />;
      }
    }
  };

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
              />
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
              />
              <Text
                style={[styles.titles, {fontSize: 18, alignSelf: 'center'}]}
              >
                All listings
              </Text>
            </TouchableOpacity>
          </View>
          {listsAroundYou()}

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
  loadingTitle: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginBottom: 20,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
