import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

const Upload = ({navigation}) => {
  return (
    <>
      <SafeAreaView>
        <Text>Upload screen placeholder</Text>
      </SafeAreaView>
    </>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
