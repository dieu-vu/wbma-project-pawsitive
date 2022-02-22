import React from 'react';
import {PropTypes} from 'prop-types';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import List from '../components/List';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MyFiles = ({navigation}) => {

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        <List navigation={navigation} myFilesOnly={true} style={{zIndex: 1, flex: 1}} />
      </View>
    </SafeAreaView>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default MyFiles;
