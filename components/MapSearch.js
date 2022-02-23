import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Platform} from 'react-native';

const MapSearch = () => {
  const iosApiKey = 'AIzaSyBiAfVQPbsDoRsc9PV3mUuLmcrFv-XDl4Q';
  const androidApiKey = 'AIzaSyCGBZwLYfYtbzlny0r3qSRCFZCnxhP6-Qg';
  const apiKey = Platform.OS === 'ios' ? iosApiKey : androidApiKey;
  return (
    <GooglePlacesAutocomplete
      placeholder="search"
      onPress={(data, details = null) => {
        console.log('GG MAP SEARCH', data, details);
      }}
      query={{
        key: apiKey,
        language: 'en',
      }}
    ></GooglePlacesAutocomplete>
  );
};

export default MapSearch;
