import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import List from '../components/List';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';

const Listing = ({navigation}) => {
  // TODO: Move map permission to a common file.
  // TODO: Add google API to Hooks for searching
  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      const permission = await askPermission();
      return permission;
    }
    return true;
  };
  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === 'granted';
  };

  const getUserLocation = async () => {
    const userLocation = await Location.getCurrentPositionAsync();
    return userLocation.coords;
  };

  useEffect(async () => {
    if (checkPermission()) {
      console.log(await getUserLocation());
    }
  });
  return (
    <>
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          showsUserLocation={true}
        ></MapView>
        <List navigation={navigation} style={{zIndex: 1}} />
      </SafeAreaView>
    </>
  );
};

Listing.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
    marginBottom: 10,
  },
});

export default Listing;
