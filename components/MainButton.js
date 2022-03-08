import React from 'react';
import {Button} from 'react-native-elements';
import {Dimensions, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {getFonts} from '../utils/Utils';

const MainButton = (props) => {
  getFonts();

  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      titleStyle={styles.titleStyle}
      buttonStyle={props.buttonStyle || styles.buttonStyle}
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
    marginBottom: '30%',
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

MainButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  buttonStyle: PropTypes.object,
  titleStyle: PropTypes.object,
};

export default MainButton;
