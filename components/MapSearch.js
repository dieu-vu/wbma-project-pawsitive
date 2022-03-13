import React, {useEffect, useRef, useState, useContext} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StyleSheet, Platform, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {MainContext} from '../contexts/MainContext';
import {
  getFonts,
  checkLocationPermission,
  askPermission,
  getUserLocation,
} from '../utils/Utils';
import {colors} from '../utils/Variables';

const MapSearch = () => {
  const iosApiKey = 'AIzaSyBiAfVQPbsDoRsc9PV3mUuLmcrFv-XDl4Q';
  const androidApiKey = 'AIzaSyCGBZwLYfYtbzlny0r3qSRCFZCnxhP6-Qg';
  const apiKey = Platform.OS === 'ios' ? iosApiKey : androidApiKey;

  const {currentUserLocation, setCurrentUserLocation, setPostLocation} =
    useContext(MainContext);

  const defaultDelta = 0.05;
  const [listViewDisplayed, setListViewDisplay] = useState(true);
  const [address, setAddress] = useState('');
  const [currentLat, setCurrentLat] = useState();
  const [currentLng, setCurrentLng] = useState();
  const [forceRefresh, setForceRefresh] = useState(0);
  const [region, setRegion] = useState({
    latitudeDelta: defaultDelta,
    longitudeDelta: defaultDelta,
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
  });

  const [marker, setMarker] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  });

  const mapRef = useRef();
  const searchRef = useRef();

  getFonts();

  // Request for user location access permission
  useEffect(async () => {
    if (checkLocationPermission()) {
      setCurrentUserLocation(await getUserLocation());
    } else {
      askPermission();
    }
  }, [currentUserLocation]);

  // Set post location and animate to the post location after the user selects the location on map search modal
  useEffect(() => {
    // console.log('SEARCH REF GET ADDRESS', searchRef.current?.getAddressText());
    searchRef.current?.setAddressText(address);
    goToInitialLocation(region);
    setPostLocation({address: address, ...region});
  }, [address, region]);

  // Function to animate to the location on the map with coords given
  const goToInitialLocation = (region) => {
    // console.log('ASSIGNED REGION', region);
    const initialRegion = Object.assign(region);
    // console.log('INITIAL REGION', initialRegion);
    mapRef.current.animateToRegion(initialRegion, 500);
  };

  // Function to handle map View actions on location change
  const onRegionChange = (region) => {
    setRegion(region);
    setForceRefresh(Math.floor(Math.random() * 100));
    setCurrentUserLocation(region);
  };

  // Function to parse the location info and update state for post location after the user selects the location on map search
  const updateLocationOnSelect = (data, details) => {
    const selectedAdress = data.description;
    const selectedLocation = {
      latitudeDelta: defaultDelta,
      longitudeDelta: defaultDelta,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    console.log('GG MAP SEARCH ADDRESS', selectedAdress);
    console.log('GG MAP SEARCH DETAILS LOCATION', selectedLocation);
    setListViewDisplay(false);
    setAddress(selectedAdress);

    setCurrentLat(selectedLocation.latitude);
    setCurrentLng(selectedLocation.longitude);
    setRegion(selectedLocation);
    setMarker(selectedLocation);
  };

  return (
    <View
      style={{flex: 1, flexDirection: 'column'}}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.mapSearchBox} keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          ref={searchRef}
          placeholder="Search"
          minLength={2}
          autoFocus={false}
          keepResultsAfterBlur={true}
          fetchDetails={true}
          onPress={(data, details) => {
            updateLocationOnSelect(data, details);
            console.log('SEARCH TEXT', searchRef);
          }}
          onFail={(error) => console.error(error)}
          query={{
            key: apiKey,
            language: 'en',
          }}
          getDefaultValue={() => {
            return !address ? '' : address; // text input default value
          }}
          textInputProps={{
            placeholderTextColor: 'gray',
            returnKeyType: 'search',
          }}
          renderDescription={(row) => row.description}
          listViewDisplayed={listViewDisplayed}
          enablePoweredByContainer={false}
          isRowScrollable={true}
          currentLocation={false}
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
          styles={{
            textInputContainer: {
              flexDirection: 'row',
              borderEndColor: colors.darkestGreen,
              borderWidth: 1,
              borderRadius: 10,
              paddingTop: 5,
              marginTop: 5,
            },
            textInput: {
              fontFamily: 'Montserrat-Regular',
              height: 38,
              color: colors.darkestGreen,
              fontSize: 16,
            },
            description: {
              fontFamily: 'Montserrat-Regular',
              color: 'black',
              fontSize: 12,
            },
            predefinedPlacesDescription: {
              color: 'black',
            },
            listView: {
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: 'white',
              borderBottomEndRadius: 15,
              elevation: 2,
            },
            container: {
              positition: 'absolute',
              height: 50,
            },
          }}
          debounce={200}
        ></GooglePlacesAutocomplete>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={region}
          onMapReady={() => {
            goToInitialLocation(region);
          }}
          onRegionChangeComplete={onRegionChange}
          debounce={200}
        >
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
        </MapView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '60%',
    zIndex: -1,
  },
  map: {
    width: '100%',
    height: '100%',
  },

  mapSearchBox: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
});

export default MapSearch;
