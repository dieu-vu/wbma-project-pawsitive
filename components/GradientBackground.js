import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const GradientBackground = () => {
  return (
    <LinearGradient
      colors={['#8DD35E', '#425E20']}
      style={styles.LinearGradient}
    ></LinearGradient>
  );
};

const styles = StyleSheet.create({
  LinearGradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 70,
    transform: [{translateY: Dimensions.get('window').height * 0.3}],
  },
});

export default GradientBackground;
