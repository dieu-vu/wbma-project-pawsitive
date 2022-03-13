import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {FAB, SearchBar} from 'react-native-elements';
import List from '../components/List';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainContext} from '../contexts/MainContext';
import CustomDropDownPicker from '../components/DropDownPicker';
import FullScreenMap from '../components/FullScreenMap';

const Listing = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [isFullMap, setIsFullMap] = useState(false);
  const [showBtnGroup, setShowBtnGroup] = useState(false);

  const {
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

  // FAB button to toggle to open full map view
  const mapState = isFullMap
    ? Dimensions.get('window').height
    : Dimensions.get('window').height * 0.33;
  const fabIcon = isFullMap ? 'arrow-collapse-all' : 'arrow-expand-all';

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenMap
        style={{
          width: Dimensions.get('window').width,
          height: mapState,
        }}
        showBtnGroup={showBtnGroup}
        navigation={navigation}
        mapPadding={
          isFullMap
            ? {top: 20, right: 20, bottom: 250, left: 20}
            : {top: 20, right: 20, bottom: 20, left: 20}
        }
      />
      <FAB
        size="small"
        icon={{name: fabIcon, type: 'material-community'}}
        color="white"
        style={{
          position: 'absolute',
          top: showBtnGroup ? 80 : 20,
          right: 20,
        }}
        onPress={() => {
          setIsFullMap(!isFullMap);
          setShowBtnGroup(!showBtnGroup);
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
            placeholder="Search for post..."
            onChangeText={updateSearch}
            value={searchValue}
            onCancel={() => {
              setIsSearching(false);
            }}
            platform={'ios'}
            containerStyle={{
              height: 60,
              width: Dimensions.get('window').width * 0.65,
            }}
          />
          <CustomDropDownPicker
            value={selectedPetType}
            dropdownTextStyle={{display: 'none'}}
            componentContainerStyle={{width: '45%'}}
            containerStyle={{alignSelf: 'flex-start'}}
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
    paddingLeft: 20,
    justifyContent: 'space-around',
    zIndex: 1,
  },
});

export default Listing;
