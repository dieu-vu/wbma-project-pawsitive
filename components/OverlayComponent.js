import React, {useState} from 'react';
import {Button, Overlay, Icon} from 'react-native-elements';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapSearch from './MapSearch';
import PropTypes from 'prop-types';

const OverlayComponent = ({onToggle}) => {
  const [visible, setVisible] = useState(onToggle);

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={() => {
          setVisible(!visible);
        }}
        overlayStyle={styles.container}
      >
        <MapSearch />
        <Button
          title="Confirm location"
          buttonStyle={styles.button}
          onPress={() => {
            setVisible(!visible);
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
    height: Dimensions.get('window').height * 0.8,
  },
});

OverlayComponent.propTypes = {
  onToggle: PropTypes.bool,
};

export default OverlayComponent;
