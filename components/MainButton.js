import React from 'react';
import {Button} from 'react-native-elements';
import {Dimensions, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

const MainButton = (props) => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      titleStyle={styles.titleStyle}
      buttonStyle={styles.buttonStyle}
    />
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 25,
  },
  buttonStyle: {
    width: Dimensions.get('window').width * 0.6,
    height: 60,
    backgroundColor: '#A9FC73',
    borderRadius: 35,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

Button.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  buttonStyle: PropTypes.object,
  titleStyle: PropTypes.object,
};

export default MainButton;
