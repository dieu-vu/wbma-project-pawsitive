import React, { useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {Dimensions, View} from 'react-native';
import {Avatar, FAB, Text, Button, Rating} from 'react-native-elements';
import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/Variables';
import PropTypes from 'prop-types';

const FullScreenMap = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 62.04164,
    longitude: 26.40757,
    latitudeDelta: 5,
    longitudeDelta: 5.5,
  });
  const [markers, setMarkers] = useState([]);
  const {mediaArray} = useMedia();
  // TODO Rating based on average of all ratings

  const addMarker = (title, coordinates, thumbnails, whole) => {
    setMarkers((oldMarkers) => [
      ...oldMarkers,
      {
        whole: whole,
        title: title,
        thumbnails: thumbnails,
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      },
    ]);
  };

  // TODO Fix loadposts so it loads / keeps the posts always visible
  const loadPostsOnMap = () => {
    if (mediaArray !== undefined) {
      mediaArray.map((mediaPost) => {
        const postOnMap = JSON.parse(mediaPost.description);
        if (postOnMap.coords !== undefined) {
          addMarker(
            mediaPost.title,
            postOnMap.coords,
            mediaPost.thumbnails,
            mediaPost
          );
          console.log(
            'title: ', mediaPost.title,
            'thumbnails', mediaPost.thumbnails,
            'coords: ', postOnMap.coords,
            'whole: ', mediaPost
          );
        }
      });
    }
  };

  const initialRegion = {
    latitude: 62.04164,
    longitude: 26.40757,
    latitudeDelta: 5,
    longitudeDelta: 5.5,
  };

  // useEffect(() => {
  //   loadPostsOnMap();
  // }, []);

  // console.log("region", region);

  return (
    <>
      <MapView
        initialRegion={initialRegion}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        mapPadding={{top: 20, right: 20, bottom: 175, left: 20}}
        onRegionChangeComplete={(region) => {
          setRegion(region);
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            title={marker.title}
            draggable
          >
            <Callout
              onPress={() => {
                console.log('is pressed');
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
                      startingValue={3.6}
                      readonly
                      imageSize={20}
                    />
                    <Text style={{marginLeft: 10}}>250 ratings</Text>
                  </View>
                </View>
                <Button
                  buttonStyle={{height: '100%', marginLeft: 10}}
                  title="View"
                />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {/* TODO fix 'fake marker' to the center no matter where the*/}
      {/* <View*/}
      {/*  style={{*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*    position: 'absolute',*/}
      {/*    top: '50%',*/}
      {/*    left: '50%',*/}
      {/*    transform: [{translateX: -15}, {translateY: -60}],*/}
      {/*    zIndex: 5,*/}
      {/*    height: 40,*/}
      {/*    width: 30,*/}
      {/*  }}>*/}
      {/*  <Image*/}
      {/*    style={{height: 41, width: 30, opacity: 0.7}}*/}
      {/*    source={require("../assets/mapMarker.png")}*/}
      {/*  />*/}
      {/* </View>*/}

      <FAB
        icon={{name: 'add-location', type: 'material-icons'}}
        title="Add marker"
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
        onPress={() => {
          addMarker('testing', region, '', '');
        }}
      />
      <FAB
        icon={{name: 'file-download', type: 'material-icons'}}
        title="Load media"
        style={{
          position: 'absolute',
          bottom: 150,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
        onPress={() => {
          loadPostsOnMap();
        }}
      />
      {/* POSSIBLE RESET MARKERS */}
      {/* <FAB*/}
      {/*  icon={{name: 'cross', type: 'entypo'}}*/}
      {/*  style={{*/}
      {/*    position: 'absolute',*/}
      {/*    bottom: 100,*/}
      {/*    left: 0,*/}
      {/*    right: 0,*/}
      {/*    zIndex: 2,*/}
      {/*  }}*/}
      {/*  onPress={() => {*/}
      {/*    setMarkers([]);*/}
      {/*  }}*/}
      {/* />*/}
    </>
  );
};

FullScreenMap.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default FullScreenMap;
