import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

const Profile = ({navigation}) => {
  return (
    <>
      <SafeAreaView>
        <Text>Profile screen placeholder</Text>
      </SafeAreaView>
    </>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
