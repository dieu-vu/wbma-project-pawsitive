import React, {useEffect, useRef, useState, useContext} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

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
  const searchUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?address=';
  const keyQuery = `&key=${apiKey}`;
  const {currentUserLocation, setCurrentUserLocation} = useContext(MainContext);

  let searchText = Object();
  let mapView = Object();
  const defaultDelta = 0.05;
  const ref = useRef();

  const [region, setRegion] = useState({
    latitudeDelta: defaultDelta,
    longitudeDelta: defaultDelta,
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
  });

  const [listViewDisplayed, setListViewDisplay] = useState(true);
  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [search, setSearch] = useState();
  const [currentLat, setcurrentLat] = useState();
  const [currentLng, setcurrentLng] = useState();
  const [forceRefresh, setForceRefresh] = useState(0);

  getFonts();

  useEffect(async () => {
    if (checkLocationPermission()) {
      setCurrentUserLocation(await getUserLocation());
    } else {
      askPermission();
    }
  }, [currentUserLocation]);

  useEffect(() => {
    ref.current?.setAddressText('');
  }, []);

  const goToInitialLocation = (region) => {
    console.log('ASSIGNED REGION', region);

    let initialRegion = Object.assign(region);
    console.log('INITIAL REGION', initialRegion);
    mapView.animateToRegion(initialRegion, 500);
  };

  const onRegionChange = (region) => {
    setRegion(region);
    setForceRefresh(Math.floor(Math.random() * 100));
    setCurrentUserLocation(region);
  };

  const getAddress = async () => {
    //function to get address using current lat and lng
    try {
      const response = await fetch(
        `${searchUrl}${region.latitude},${region.longitude}${keyQuery}`
      );
      const responseJson = await response.json();
      const coords = await JSON.stringify(responseJson);
      console.log('ADDRESS Geocode ' + coords);
      setAddress({
        address: JSON.stringify(
          await responseJson.results[0].formatted_address
        ).replace(/"/g, ''),
      });
    } catch (e) {
      console.error('GET ADDRESS ERROR ', e);
    }
  };

  // TODO: can select onPress, check API result
  return (
    <View
      style={{flex: 1, flexDirection: 'column'}}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.mapSearchBox} keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          ref={(ref) => (searchText = ref)}
          placeholder="Search"
          minLength={2}
          autoFocus={false}
          keepResultsAfterBlur={true}
          fetchDetails={true}
          onPress={(data, details) => {
            console.log('GG MAP SEARCH DATA', data);
            console.log('GG MAP SEARCH DETAILS', details);
            console.log(
              'GG MAP SEARCH DETAILS LOCATION',
              details.geometry.location
            );
            const selectedAdress = data.description;
            const selectedLocation = details.geometry.location;

            console.log('SELECTED LOCATION', selectedLocation);
            setListViewDisplay(false);
            setAddress(selectedAdress);
            console.log('CURRENT ADDRESS', address);

            console.log(
              'CURRENT LAT FROM DETAILS ',
              details.geometry.location.latitude
            );
            setcurrentLat(selectedLocation.latitude);
            console.log('CURRENT LAT', currentLat);

            setcurrentLng(selectedLocation.longitude);
            console.log('CURRENT Lng', currentLng);

            setRegion({
              latitudeDelta: defaultDelta,
              longitudeDelta: defaultDelta,
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            });

            console.log('CURRENT REGION', region);
            searchText.setAddressText('');
            // goToInitialLocation(region);
          }}
          onFail={(error) => console.error(error)}
          query={{
            key: apiKey,
            language: 'en',
          }}
          // getDefaultValue={() => {
          //   return ''; // text input default value
          // }}
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
        ></GooglePlacesAutocomplete>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          ref={(ref) => (mapView = ref)}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={region}
          onMapReady={() => {
            goToInitialLocation(region);
          }}
          onRegionChangeComplete={onRegionChange}
          debounce={500}
        />
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
