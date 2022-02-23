import React, {useState, useContext} from 'react';
import {Button, Overlay, Icon} from 'react-native-elements';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapSearch from './MapSearch';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const MapOverlayComponent = () => {
  const {mapOverlayVisible, setMapOverlayVisible} = useContext(MainContext);

  return (
    <View>
      <Overlay
        isVisible={mapOverlayVisible}
        onBackdropPress={() => {
          setMapOverlayVisible(!mapOverlayVisible);
        }}
        overlayStyle={styles.container}
      >
        <MapSearch />
        <Button
          title="Confirm location"
          buttonStyle={styles.button}
          onPress={() => {
            setMapOverlayVisible(!mapOverlayVisible);
          }}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  container: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.75,
  },
});

export default MapOverlayComponent;
