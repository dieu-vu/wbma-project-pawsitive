import React from 'react';
import {Button} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import PropTypes from 'prop-types';

const CustomButton = (props) => {
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
      titleStyle={[styles.titleStyle, {fontSize: props.fontSize}]}
      buttonStyle={styles.buttonStyle}
    />
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  buttonStyle: {
    width: '60%',
    height: undefined,
    backgroundColor: '#A9FC73',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    alignSelf: 'center',
  },
});

CustomButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  fontSize: PropTypes.number,
  buttonStyle: PropTypes.object,
  titleStyle: PropTypes.object,
};

export default CustomButton;
