import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Dimensions, View, SafeAreaView, Text} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserList from '../components/UserList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useRating, useUser} from '../hooks/ApiHooks';
import UserInfoModal from '../components/UserInfoModal';
import PlaceholderImage from '../components/PlaceholderImage';

const SubscriberList = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const fileId = route.params.file.file_id;
  console.log('FILE ID', fileId);
  const {userInfoModalVisible, viewedSubscriber} = useContext(MainContext);
  const {getAllUserId, getUserInfo} = useUser();
  const {getPostsByUserId} = useMedia();
  const {getRatingsForFile} = useRating();
  const [subscriberArray, setSubscriberArray] = useState();
  const [allUserLoaded, setAllUserLoaded] = useState(false);

  const getSubscriberList = async (fileId) => {
    /*
- Get all user id List
- Save user id list and get array of user details
- if user has full_name.subscribed_media == file_id, then save that user_id object to an array
- use array above to build list
*/

    /* TODO: Error : "Please report: Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code".
How to reload after a while?
*/
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await getAllUserId(token);
      console.log('ALL USER ID', response.length);

      if (response) {
        try {
          const allUserInfo = await Promise.all(
            response.map(async (userId) => {
              return await getUserInfo(userId, token);
            })
          );
          if (allUserInfo) {
            console.log('ALL USER info', allUserInfo.length);
            await getSubscriberHelper(allUserInfo);
          }
          setAllUserLoaded(true);
        } catch (e) {
          console.error('GET SUBSCRIBER DETAILS ERROR ', e);
        }
      }
    } catch (e) {
      console.error('GET SUBSCRIBER LIST ERROR ', e);
    }
  };

  // function to get array of subscriber details
  const getSubscriberHelper = async (userArray) => {
    console.log('USER ARRAY', userArray.length);
    const updatedSubscriberArray = [];
    if (userArray.length > 0) {
      await Promise.all(
        userArray.map((user) => {
          // console.log('CHECKING USER', user.user_id);

          const isSubscriber = checkSubscription(user);
          // console.log('IS SUBCRIBER', isSubscriber);
          if (isSubscriber) {
            console.log('user subcribed', user);
            updatedSubscriberArray.push(user);
            console.log('list user subcribed', updatedSubscriberArray);
          }
        })
      );
    }
    setSubscriberArray(updatedSubscriberArray);
    console.log('SUBSCRIBER ARRAY', subscriberArray);
  };

  // function to check subscription of each user
  const checkSubscription = (userObject) => {
    let userInfo = {};
    if (
      userObject.full_name &&
      userObject.full_name.includes('subscribed_media')
    ) {
      userInfo = JSON.parse(userObject.full_name);
      console.log('CHECK SUBSCRIPTION USER INFO', userInfo);
      if (
        userInfo &&
        userInfo.subscribed_media &&
        userInfo.subscribed_media.includes(fileId)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    // TODO: Add timeout here to try again?
    getSubscriberList(fileId);
    console.log('LIST SUBSCRIBER', subscriberArray);
  }, [allUserLoaded]);

  const calculateRatingForUser = async (userId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const mediaFiles = await getPostsByUserId(userId);
      console.log('media files', mediaFiles);
      let sum = 0;
      let count = 0;
      const response = await Promise.all(
        mediaFiles.map(async (item) => {
          const ratings = await getRatingsForFile(item.file_id, userToken);
          ratings.forEach((item) => {
            const rating = item.rating;
            console.log(rating);
            sum += rating;
            count++;
          });
        })
      );
      if (response) {
        const average = sum / count;
        console.log('average', Math.round(average));
        return average;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('getting post for user error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingBottom: insets.bottom,
          flex: 1,
        }}
      >
        {!allUserLoaded ? (
          <View>
            <PlaceholderImage />
            <Text style={styles.text}>
              Be patient, we are getting the subscriber list
            </Text>
          </View>
        ) : (
          <UserList
            navigation={navigation}
            userArray={subscriberArray}
            style={{flex: 1}}
          />
        )}
        {userInfoModalVisible ? (
          <UserInfoModal
            subscriber={viewedSubscriber}
            navigation={navigation}
          />
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

SubscriberList.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    zIndex: 1,
    fontSize: 16,
  },
});

export default SubscriberList;
