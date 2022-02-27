import React, {useState, useContext} from 'react';
import {Button, Overlay, Icon} from 'react-native-elements';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import MapSearch from './MapSearch';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const MapOverlayComponent = () => {
  const {mapOverlayVisible, setMapOverlayVisible, postLocation} =
    useContext(MainContext);

  return (
    <TouchableOpacity
      style={{flexGrow: 1}}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      keyboardShouldPersistTaps="handled"
    >
      <Overlay
        isVisible={mapOverlayVisible}
        onBackdropPress={() => {
          setMapOverlayVisible(!mapOverlayVisible);
        }}
        overlayStyle={styles.container}
        keyboardShouldPersistTaps="handled"
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
    </TouchableOpacity>
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
