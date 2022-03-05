import React, {useContext, useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {Dimensions, View} from 'react-native';
import {
  Avatar,
  FAB,
  Text,
  Button,
  Rating,
  ButtonGroup,
} from 'react-native-elements';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {colors} from '../utils/Variables';

const FullScreenMap = ({navigation}) => {
  const {markers, currentUserLocation} = useContext(MainContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // console.log('MARKERS', markers);
  // TODO Rating based on average of all ratings

  const initialRegion = {
    latitude: currentUserLocation.latitude,
    longitude: currentUserLocation.longitude,
    latitudeDelta: 1,
    longitudeDelta: 1.5,
  };

  return (
    <>
      <ButtonGroup
        buttons={['Pet Sitters', 'Pet Owners']}
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
      <MapView
        initialRegion={initialRegion}
        style={{
          width: Dimensions.get('window').width,
          height: '100%',
        }}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        mapPadding={{top: 20, right: 20, bottom: 145, left: 20}}
      >
        {[...markers].map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            title={marker.title}
          >
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
                  <Text h4 style={{marginBottom: 25}}>
                    {marker.title}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Rating
                      type="star"
                      fractions={1}
                      // TODO startingValue to be a rating state that is calculated from average of all ratings
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
                  <Text style={{marginLeft: 20}} h3>{`0 €`}</Text>
                ) : (
                  <Text style={{marginLeft: 30}} h3>{`${marker.price} €`}</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </>
  );
};

FullScreenMap.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default FullScreenMap;
