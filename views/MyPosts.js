import React, {useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import List from '../components/List';
import {MainContext} from '../contexts/MainContext';


const MyPosts = ({navigation}) => {

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.listContainer}>
        <List
          navigation={navigation}
          myFilesOnly={true}
          style={styles.flatList}
        />
      </View>
    </SafeAreaView>
  );
};

MyPosts.propTypes = {
  navigation: PropTypes.object,
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    alignSelf: 'center',
    transform: [{scaleX: 0.95}],
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 6,
    marginHorizontal: 5,
    marginTop: 3,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#8DD35E',
    borderRadius: 12,
    bottom: -15,
  },
});

export default MyPosts;
