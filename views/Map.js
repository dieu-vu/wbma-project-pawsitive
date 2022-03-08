import React from 'react';
import FullScreenMap from '../components/FullScreenMap';
import {SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';

const Map = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FullScreenMap navigation={navigation} />
    </SafeAreaView>
  );
};

Map.propTypes = {
  navigation: PropTypes.object,
};

export default Map;
