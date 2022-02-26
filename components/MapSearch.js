import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
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

  const defaultDelta = 0.05;
  const [listViewDisplayed, setListViewDisplay] = useState(true);
  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [search, setSearch] = useState();
  const [currentLat, setCurrentLat] = useState();
  const [currentLng, setCurrentLng] = useState();
  const [forceRefresh, setForceRefresh] = useState(0);
  const [region, setRegion] = useState({
    latitudeDelta: defaultDelta,
    longitudeDelta: defaultDelta,
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
  });

  const mapView = Object();
  const mapRef = useRef();
  const searchRef = useRef();

  getFonts();

  // const refCallBack = () => {
  //   const ref = useRef();
  //   const setRef = useCallback((node) => {
  //     if (ref.current && node) {
  //       ref.current.setAddressText('');
  //     }
  //   }, []);
  // };

  useEffect(async () => {
    if (checkLocationPermission()) {
      setCurrentUserLocation(await getUserLocation());
    } else {
      askPermission();
    }
  }, [currentUserLocation]);

  useEffect(() => {
    console.log('SEARCH REF GET ADDRESS', searchRef.current?.getAddressText());
    searchRef.current?.setAddressText('');
    console.log('CURRENT ADDRESS setState ', address);
    console.log('CURRENT REGION', region);
    goToInitialLocation(region);
  }, [address, region]);

  const goToInitialLocation = (region) => {
    console.log('ASSIGNED REGION', region);

    let initialRegion = Object.assign(region);
    console.log('INITIAL REGION', initialRegion);
    mapRef.current.animateToRegion(initialRegion, 500);
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
    console.log('CURRENT ADDRESS', selectedAdress);

    // console.log('CURRENT LAT FROM DETAILS ', selectedLocation.latitude);
    // console.log('CURRENT LAT FROM STATE ', typeof selectedLocation.latitude);

    setCurrentLat(selectedLocation.latitude);

    setCurrentLng(selectedLocation.longitude);

    setRegion(selectedLocation);
  };

  // TODO: can select onPress, check API result
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
            searchRef.current.setAddressText(address);
          }}
          onFail={(error) => console.error(error)}
          query={{
            key: apiKey,
            language: 'en',
          }}
          getDefaultValue={() => {
            return ''; // text input default value
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
