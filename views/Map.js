import React from 'react';
import FullScreenMap from '../components/FullScreenMap';
import {SafeAreaView} from 'react-native';

const Map = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FullScreenMap />
    </SafeAreaView>
  );
};

export default Map;
