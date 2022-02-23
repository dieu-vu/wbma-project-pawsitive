import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {FAB, SearchBar} from 'react-native-elements';
import List from '../components/List';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainContext} from '../contexts/MainContext';

const Listing = ({navigation}) => {
  // TODO: Move map permission to a common file.
  // TODO: Add google API to Hooks for searching
  const insets = useSafeAreaInsets();
  const [isFullMap, setIsFullMap] = useState(false);
  const {isSearching, setIsSearching, searchValue, setSearchValue} =
    useContext(MainContext);

  const updateSearch = (search) => {
    setSearchValue(search);
    setIsSearching(true);
  };

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
      console.log('USER LOCATION', await getUserLocation());
    }
  });

  const mapState = isFullMap
    ? Dimensions.get('window').height
    : Dimensions.get('window').height * 0.4;
  const fabIcon = isFullMap ? 'arrow-collapse-all' : 'arrow-expand-all';
  console.log('searchbar value', searchValue);
  console.log('searchingstate', isSearching);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={{
          width: Dimensions.get('window').width,
          height: mapState,
        }}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
      />
      <FAB
        size="small"
        icon={{name: fabIcon, type: 'material-community'}}
        color="white"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
        onPress={() => {
          setIsFullMap(!isFullMap);
        }}
      />
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <SearchBar
          placeholder="Search..."
          onChangeText={updateSearch}
          value={searchValue}
          onCancel={() => {
            setIsSearching(false);
          }}
          platform={'ios'}
          containerStyle={{height: 60}}
        />
        <List navigation={navigation} style={{zIndex: 1, flex: 1}} />
      </View>
    </SafeAreaView>
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
});

export default Listing;
