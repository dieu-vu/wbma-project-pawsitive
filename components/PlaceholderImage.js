import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {Dimensions, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const PlaceholderImage = (props) => {
  const animation = React.createRef();
  useEffect(() => {
    animation.current?.play();
  }, [animation]);

  return (
    <LottieView
      source={require('../assets/loading-animation.json')}
      ref={animation}
      autoPlay={true}
      loop={true}
      style={props.style || styles.lottie}
    />
  );
};

PlaceholderImage.propTypes = {
  style: PropTypes.object,
}

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
  }
})

export default PlaceholderImage;
