import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import List from '../components/List';

const Home = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <List navigation={navigation} style={{zIndex: 1}} />
      </SafeAreaView>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
