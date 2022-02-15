import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import List from '../components/List';

const Listing = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <List navigation={navigation} style={{zIndex: 1}} />
      </SafeAreaView>
    </>
  );
};

Listing.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Listing;
