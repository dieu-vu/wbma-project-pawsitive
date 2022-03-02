import React, {useContext} from 'react';
import AppLoading from 'expo-app-loading';
import {useFonts} from '@expo-google-fonts/inter';
import {useUser, useTag} from '../hooks/ApiHooks';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';

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

const fetchAvatar = async (data) => {
  const {getFilesByTag} = useTag();
  try {
    const avatarArray = await getFilesByTag('avatar_' + data.user_id);
    if (avatarArray.length === 0) {
      return;
    }
    const avatar = avatarArray.pop();
    console.log('AVATAR FETCHED', avatar);
    return avatar.filename;
  } catch (error) {
    console.error(error.message);
  }
};

const checkLocationPermission = async () => {
  const hasPermission = await Location.requestForegroundPermissionsAsync();
  if (hasPermission.status === 'granted') {
    const permission = await askPermission();
    return permission;
  }
  return true;
};

const askPermission = async () => {
  const permission = await Location.requestForegroundPermissionsAsync();
  return permission.status === 'granted';
};

const getUserLocation = async () => {
  const userLocation = await Location.getLastKnownPositionAsync();
  return userLocation.coords;
};

const getMediaPreviousCategoryTag = async (file, category) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const {getTagsForFile} = useTag();
    const listCurrentTags = await getTagsForFile(file.file_id, token);

    if (!listCurrentTags) {
      return;
    }
    const latestCategoryTypeTag = listCurrentTags
      .filter((tag) => tag.tag.includes(`pawsitive_${category}_`))
      .pop();
    if (!latestCategoryTypeTag) {
      return;
    }
    console.log('latest category tag', latestCategoryTypeTag);
    return latestCategoryTypeTag.tag.split('_').pop();
  } catch (e) {
    console.error(e);
  }
};

export {
  pickRandomImage,
  formatDate,
  getFonts,
  fetchAvatar,
  checkLocationPermission,
  askPermission,
  getUserLocation,
  getMediaPreviousCategoryTag,
};
