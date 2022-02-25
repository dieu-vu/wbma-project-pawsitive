import React from 'react';
import FullScreenMap from '../components/FullScreenMap';
import {SafeAreaView} from 'react-native';

const Map = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FullScreenMap navigation={navigation} />
    </SafeAreaView>
  );
};

export default Map;
