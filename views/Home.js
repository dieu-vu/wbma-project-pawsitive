import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

const Home = ({navigation}) => {
  return (
    <>
      <SafeAreaView>
        <Text>This is home screen</Text>
      </SafeAreaView>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
