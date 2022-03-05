/*
- Get all user id List
- Save user id list and get array of user details
- if user has full_name.subscribed_media == file_id, then save that user_id object to an array
- use array above to build list
*/
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainContext} from '../contexts/MainContext';

const SubscriberList = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {user} = useContext(MainContext);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <List navigation={navigation} style={{flex: 1}} />
      </View>
    </SafeAreaView>
  );
};

SubscriberList.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  SbAndDropContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    justifyContent: 'flex-start',
  },
});

export default SubscriberList;
