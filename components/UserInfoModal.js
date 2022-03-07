import React, {useContext, useState, useEffect} from 'react';
import {Button, Overlay, Card, Avatar, Text} from 'react-native-elements';
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {fetchAvatar} from '../utils/Utils';
import CustomButton from './CustomButton';
import {uploadsUrl, colors} from '../utils/Variables';
import {useMedia, useRating} from '../hooks/ApiHooks';
import UserHistoryListItem from './UserHistoryListItem';
import PlaceholderImage from './PlaceholderImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoModal = (props) => {
  const {userInfoModalVisible, setUserInfoModalVisible} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState('../assets/user.png');
  const {getPostsByUserIdExceptAvatar, mediaArray} = useMedia();
  const {getRatingsForFile} = useRating();
  const [userFiles, setUserFiles] = useState([]);

  const [userFilesLoaded, setUserFilesLoaded] = useState(false);

  console.log('USER INFO MODAL', props.subscriber);
  console.log('USER ID MODAL', props.subscriber.user_id);

  let subscriberInfo = {};
  if (
    props.subscriber.full_name &&
    props.subscriber.full_name.includes('average_rating')
  ) {
    subscriberInfo = JSON.parse(props.subscriber.full_name);
  }

  useEffect(async () => {
    const avatarFile = await fetchAvatar(props.subscriber);
    setAvatar(uploadsUrl + avatarFile);
  }, []);

  const getUserFileDetails = async () => {
    const fileList = await getPostsByUserIdExceptAvatar(
      props.subscriber.user_id
    );
    const fileIdList = await fileList.map((file) => {
      return file.file_id;
    });
    console.log('FILE ID LIST', fileIdList);
    // Use the file Id list to get needed file from mediaArray
    const subscriberFilesOnly = await Promise.all(
      mediaArray.filter((file) => {
        if (fileIdList.includes(file.file_id)) {
          return file;
        }
      })
    );

    // Update subscriberArray to add the average ratings per post and call this on subscriberArray changes:
    const updatedsubscriberFilesOnly = await Promise.all(
      subscriberFilesOnly.map(async (file) => {
        const averageRating = await calculateRatingForPost(file.file_id);
        file['average_rating'] = averageRating;
        // console.log('updated file', file);
        return file;
      })
    );
    console.log('FILE LIST', updatedsubscriberFilesOnly);
    setUserFiles(updatedsubscriberFilesOnly);
    setUserFilesLoaded(true);
  };

  useEffect(async () => {
    await getUserFileDetails();
    console.log('SUBSCRIBER POSTS', userFiles);
    console.log('SUBSCRIBER POSTS READY', userFilesLoaded);
  }, [userFilesLoaded]);

  // CALCULATE RATINGS FOR POST
  const calculateRatingForPost = async (fileId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const ratings = await getRatingsForFile(fileId, userToken);
      let average = 0;
      if (ratings) {
        let sum = 0;
        let count = 0;
        ratings.forEach((item) => {
          const rating = item.rating;
          // console.log(rating);
          sum += rating;
          count++;
          average = sum / count;
          console.log('average rating', Math.round(average));
        });
        return average;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* TODO:  Error: No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first. */
  return (
    <Overlay
      isVisible={userInfoModalVisible}
      onBackdropPress={() => {
        setUserInfoModalVisible(!userInfoModalVisible);
      }}
      overlayStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        style={{
          flex: 1,
          flexDirection: 'column',
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <Text h2 style={[styles.text, styles.username]}>
            {props.subscriber.username}
          </Text>
          <Text style={[styles.text, styles.username]}>
            {props.subscriber.email}
          </Text>
          <Text style={[styles.text, {alignSelf: 'center', paddingBottom: 20}]}>
            User's average rating:{'\n '}
            {subscriberInfo.average_rating
              ? subscriberInfo.average_rating
              : 'Not yet available'}
          </Text>
          <Image
            source={{uri: avatar}}
            style={styles.avatarImage}
            resizeMode="cover"
          ></Image>
        </View>
        <View>
          <Text h4 style={[styles.text, styles.username]}>
            User's posts
          </Text>
          {/* Show a list of posts with rating info here */}
        </View>
        <View>
          {!userFilesLoaded ? (
            <PlaceholderImage />
          ) : userFilesLoaded && userFiles.length > 0 ? (
            // <Text>{userFiles.length} files found</Text>
            <FlatList
              data={userFiles}
              keyExtractor={(item) => item.file_id.toString()}
              renderItem={({item}) => <UserHistoryListItem file={item} />}
              ListFooterComponent={() => {
                return null;
              }}
            />
          ) : userFilesLoaded && userFiles.length === 0 ? (
            <Text style={[styles.text, {alignSelf: 'center'}]}>No media</Text>
          ) : (
            <PlaceholderImage />
          )}
        </View>
      </ScrollView>
      <View style={{position: 'sticky', paddingTop: 10}}>
        <CustomButton
          title="Close"
          fontSize={16}
          onPress={() => {
            setUserInfoModalVisible(!userInfoModalVisible);
          }}
        />
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  container: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.75,
  },
  text: {
    textAlign: 'left',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    zIndex: 1,
    fontSize: 16,
  },
  avatarImage: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 25,
    alignSelf: 'center',
  },
  username: {
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    paddingBottom: 25,
    paddingTop: 25,
  },
});

UserInfoModal.propTypes = {
  subscriber: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default UserInfoModal;
