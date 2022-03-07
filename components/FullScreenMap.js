import React, { useContext, useEffect, useState } from "react";
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Avatar, Text, Rating, ButtonGroup} from 'react-native-elements';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {colors} from '../utils/Variables';

const FullScreenMap = ({
  navigation,
  style,
  showBtnGroup = true,
  mapPadding,
}) => {
  const {markers, petOwnerMarkers, petSitterMarkers, currentUserLocation} =
    useContext(MainContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const initialRegion = {
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
    latitudeDelta: 1,
    longitudeDelta: 1.5,
  };

  const allMarkers = (typeOfUserArray) => {
    return [...typeOfUserArray].map((marker, index) => (
      <Marker key={index} coordinate={marker.coordinates} title={marker.title}>
        <Callout
          onPress={() => {
            navigation.navigate('Single', {file: marker.whole});
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: 5,
              alignItems: 'center',
              height: 100,
              width: 350,
            }}
          >
            <Avatar
              size={75}
              rounded
              source={{
                uri: uploadsUrl + marker.thumbnails.w160,
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text style={{marginBottom: 25, fontSize: 20}}>
                {marker.title}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Rating
                  type="star"
                  fractions={1}
                  startingValue={marker.ratingAverage}
                  readonly
                  imageSize={20}
                />
                <Text
                  style={{marginLeft: 10}}
                >{`${marker.ratingCount} ratings`}</Text>
              </View>
            </View>
            {marker.price === undefined ? (
              <Text style={{marginLeft: 20}} h4>{`0 €`}</Text>
            ) : (
              <Text style={{marginLeft: 20}} h4>{`${marker.price} €`}</Text>
            )}
          </View>
        </Callout>
      </Marker>
    ));
  };

  const getFileIdsOwner = [...petOwnerMarkers].map(
    (post, index) => [...petOwnerMarkers][index].postFileId
  );
  const getFileIdsSitter = [...petSitterMarkers].map(
    (post, index) => [...petSitterMarkers][index].postFileId
  );

  const allPetSitters = [...markers].filter((item) =>
    getFileIdsSitter.includes(item.whole.file_id)
  );
  const allPetOwners = [...markers].filter((item) =>
    getFileIdsOwner.includes(item.whole.file_id)
  );

  const showCorrectMarkers = () => {
    switch (selectedIndex) {
      case 1: {
        // console.log('selected index', selectedIndex);
        return allMarkers(allPetSitters);
      }
      case 2: {
        // console.log('selected index', selectedIndex);
        return allMarkers(allPetOwners);
      }
      default: {
        // console.log('selected index', selectedIndex);
        return allMarkers(markers);
      }
    }
  };

  const [correctMarkers, setCorrectMarkers] = useState();

  useEffect(() => {
    setCorrectMarkers(showCorrectMarkers());
  }, [selectedIndex]);

  return (
    <>
      {showBtnGroup ? (
        <ButtonGroup
          buttons={['All', 'Pet Sitters', 'Pet Owners']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
          containerStyle={{height: 50}}
          textStyle={{
            fontFamily: 'Montserrat-SemiBold',
          }}
          selectedButtonStyle={{
            backgroundColor: colors.darkestGreen,
          }}
        />
      ) : (
        <></>
      )}

      <MapView
        initialRegion={initialRegion}
        style={style || styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        mapPadding={mapPadding || {top: 20, right: 20, bottom: 145, left: 20}}
      >
        {correctMarkers}
      </MapView>
    </>
  );
};

FullScreenMap.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
  showBtnGroup: PropTypes.bool,
  mapPadding: PropTypes.object,
};

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});
export default FullScreenMap;
