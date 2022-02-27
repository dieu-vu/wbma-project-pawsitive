import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {FAB, SearchBar} from 'react-native-elements';
import List from '../components/List';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainContext} from '../contexts/MainContext';
import CustomDropDownPicker from '../components/DropDownPicker';
import {
  checkLocationPermission,
  askPermission,
  getUserLocation,
} from '../utils/Utils';

const Listing = ({navigation}) => {
  // TODO: Move map permission to a common file.
  // TODO: Add google API to Hooks for searching
  const insets = useSafeAreaInsets();
  const [isFullMap, setIsFullMap] = useState(false);
  const {currentUserLocation, setCurrentUserLocation} = useContext(MainContext);

  const {
    isSearching,
    setIsSearching,
    searchValue,
    setSearchValue,
    selectedPetType,
    setSelectedPetType,
  } = useContext(MainContext);

  const items = [
    {label: 'All', value: 'all'},
    {label: 'Dog', value: 'dog'},
    {label: 'Cat', value: 'cat'},
    {label: 'Bird', value: 'bird'},
    {label: 'Other', value: 'other'},
  ];

  const updateSearch = (search) => {
    setSearchValue(search);
    setIsSearching(true);
  };

  /* make current latitude and longitude to be current location if user gives permission sharing their location
   otherwise, ask for permission*/

  const mapState = isFullMap
    ? Dimensions.get('window').height
    : Dimensions.get('window').height * 0.4;
  const fabIcon = isFullMap ? 'arrow-collapse-all' : 'arrow-expand-all';

  useEffect(() => {
    console.log('selectedPetType', selectedPetType);
  }, [selectedPetType]);

  useEffect(async () => {
    if (checkLocationPermission()) {
      setCurrentUserLocation(await getUserLocation());
      console.log('USER LOCATION', currentUserLocation);
    } else {
      askPermission();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        initialRegion={{
          latitude: currentUserLocation.latitude,
          longitude: currentUserLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
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
        <View style={styles.SbAndDropContainer}>
          <SearchBar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={searchValue}
            onCancel={() => {
              setIsSearching(false);
            }}
            platform={'ios'}
            containerStyle={{
              height: 60,
              width: Dimensions.get('window').width * 0.68,
            }}
          />

          <CustomDropDownPicker
            value={selectedPetType}
            dropdownTextStyle={{display: 'none'}}
            componentContainerStyle={{width: '30%'}}
            containerStyle={{alignSelf: 'center'}}
            dropdownPlaceholder="Filter By"
            items={items}
            setValue={setSelectedPetType}
          />
        </View>

        <List navigation={navigation} style={{flex: 1}} />
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
  SbAndDropContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
});

export default Listing;
