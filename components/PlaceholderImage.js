import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {Dimensions} from 'react-native';

const PlaceholderImage = () => {
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
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.5,
        aspectRatio: 1,
        alignSelf: 'center',
        backgroundColor: 'white',
      }}
    />
  );
};

export default PlaceholderImage;
