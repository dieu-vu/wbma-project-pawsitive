import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView, Text} from 'react-native';
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
  const {userInfoModalVisible, viewedSubscriber} = useContext(MainContext);
  const {getUserInfo} = useUser();
  const {getPostsByUserId, mediaArray} = useMedia();
  const {getRatingsForFile} = useRating();
  const [subscriberArray, setSubscriberArray] = useState();
  const [allUserLoaded, setAllUserLoaded] = useState(false);
  const [subscriberArrayLoading, setSubscriberArrayLoading] = useState();

  // Function to retrieve all subscribers of the file id
  const getSubscriberList = async (fileId) => {
    /*
- Get all user id from media array
- Save user id list and get array of user details
- if user has full_name.subscribed_media == file_id, then save that user_id object to an array
- use array above to build list
*/

    const token = await AsyncStorage.getItem('userToken');

    const appUserIds = await Promise.all(
      mediaArray.map((media) => {
        return media.user_id;
      })
    );
    const appUserUniqueIds = [...new Set(appUserIds)];

    try {
      const allUserInfo = await Promise.all(
        appUserUniqueIds.map(async (userId) => {
          return await getUserInfo(userId, token);
        })
      );
      if (allUserInfo) {
        await getSubscriberHelper(allUserInfo);
      }
      setAllUserLoaded(true);
    } catch (e) {
      console.error('GET SUBSCRIBER DETAILS ERROR ', e);
    }
  };

  // function to get an array of subscriber details
  const getSubscriberHelper = async (userArray) => {
    const updatedSubscriberArray = [];
    if (userArray.length > 0) {
      await Promise.all(
        userArray.map((user) => {
          const isSubscriber = checkSubscription(user);
          if (isSubscriber) {
            updatedSubscriberArray.push(user);
          }
        })
      );
    }
    const subscriberArrayWithRatings = await Promise.all(
      updatedSubscriberArray.map(async (user) => {
        const averageRating = await calculateRatingForUser(user.user_id);
        user['average_rating'] = averageRating;
        return user;
      })
    );
    setSubscriberArray(subscriberArrayWithRatings);
  };

  // function to check subscription of each user
  const checkSubscription = (userObject) => {
    let userInfo = {};
    if (
      userObject.full_name &&
      userObject.full_name.includes('subscribed_media')
    ) {
      userInfo = JSON.parse(userObject.full_name);
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
    getSubscriberList(fileId);
  }, [subscriberArray]);

  // Wait up to 3 seconds after all Subscribers Loaded, if there is no change, show no subscribers message
  useEffect(() => {
    setSubscriberArrayLoading(true);
    const timer = setTimeout(() => {
      setSubscriberArrayLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [subscriberArray]);

  const calculateRatingForUser = async (userId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const mediaFiles = await getPostsByUserId(userId);
      let sum = 0;
      let count = 0;
      const response = await Promise.all(
        mediaFiles.map(async (item) => {
          const ratings = await getRatingsForFile(item.file_id, userToken);
          ratings.forEach((item) => {
            const rating = item.rating;
            sum += rating;
            count++;
          });
        })
      );
      if (response) {
        if (count === 0) {
          return 0;
        }
        const average = sum / count;
        return Math.round((average + Number.EPSILON) * 100) / 100;
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
        ) : !subscriberArrayLoading && subscriberArray.length === 0 ? (
          <Text style={styles.text}>No subscribers</Text>
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
