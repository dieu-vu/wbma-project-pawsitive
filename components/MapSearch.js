import React, {useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StyleSheet, Platform, View, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const MapSearch = () => {
  const iosApiKey = 'AIzaSyBiAfVQPbsDoRsc9PV3mUuLmcrFv-XDl4Q';
  const androidApiKey = 'AIzaSyCGBZwLYfYtbzlny0r3qSRCFZCnxhP6-Qg';
  const apiKey = Platform.OS === 'ios' ? iosApiKey : androidApiKey;
  const searchUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?address=';

  const [state, setState] = useState({
    region: {
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
      latitude: 12.840575,
      longitude: 77.651787,
    },
  });

  const getAddress = async () => {
    //function to get address using current lat and lng
    const response = await fetch(
      `${searchUrl}${state.region.latitude},${state.region.longitude}`
    );
    const json = response.json();
    const coords = JSON.stringify(json);
    console.log('address Geocode ' + coords);
  };
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <GooglePlacesAutocomplete
        placeholder="search"
        onPress={(data, details = null) => {
          console.log('GG MAP SEARCH', data, details);
        }}
        onFail={(error) => console.error(error)}
        query={{
          key: apiKey,
          language: 'en',
        }}
        style={styles.mapSearchBox}
      ></GooglePlacesAutocomplete>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        initialRegion={state.region}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  map: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  mapSearchBox: {},
});

export default MapSearch;
