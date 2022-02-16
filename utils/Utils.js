import React from 'react';
import AppLoading from 'expo-app-loading';
import {useFonts} from '@expo-google-fonts/inter';

const loginScreenImages = [
  require('../assets/dogSmiling1.jpg'),
  require('../assets/dogSmiling2.jpg'),
  require('../assets/sheepGroup.jpg'),
];

const pickRandomImage = () => {
  const selection = Math.floor(Math.random() * loginScreenImages.length);
  return loginScreenImages[selection];
};

const formatDate = (date) => {
  return (
    `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}` +
    ` ${date.getHours()}:${date.getMinutes()}`
  );
};

const getFonts = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
};

export {pickRandomImage, formatDate, getFonts};
