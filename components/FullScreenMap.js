import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {Dimensions, View} from 'react-native';
import {Avatar, FAB, Text, Button, Rating} from 'react-native-elements';

const FullScreenMap = (props) => {
  const [region, setRegion] = useState({
    latitude: 62.04164,
    longitude: 26.40757,
    latitudeDelta: 5,
    longitudeDelta: 5.5,
  });
  const [markers, setMarkers] = useState([]);
  // TODO Rating based on average of all ratings


  const addMarker = (title, coordinates) => {
    setMarkers((oldMarkers) => [
      ...oldMarkers,
      {
        title: title,
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      },
    ]);
  };

  const initialRegion = {
    latitude: 62.04164,
    longitude: 26.40757,
    latitudeDelta: 5,
    longitudeDelta: 5.5,
  };

  // console.log("region", region);

  return (
    <>
      <MapView
        initialRegion={initialRegion}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.82,
        }}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
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
            <Callout>
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
                    uri: 'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg',
                  }}
                  title="Avatar"
                  containerStyle={{backgroundColor: 'grey'}}
                />
                <View style={{marginLeft: 10}}>
                  <Text h4 style={{marginBottom: 25}}>
                    Girl from downtown
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Rating
                      // showRating
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
        title='Add marker'
        style={{
          position: 'absolute',
          bottom: 100,
          left: 50,
          zIndex: 2,
        }}
        onPress={() => {
          addMarker('testing', region);
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

FullScreenMap.propTypes = {};

export default FullScreenMap;
