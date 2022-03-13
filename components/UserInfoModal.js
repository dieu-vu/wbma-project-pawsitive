import React, {useContext, useState, useEffect} from 'react';
import {Overlay, Text} from 'react-native-elements';
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
import {uploadsUrl} from '../utils/Variables';
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

  useEffect(async () => {
    const avatarFile = await fetchAvatar(props.subscriber);
    setAvatar(uploadsUrl + avatarFile);
  }, []);

  // Function to get an array of subscriber's media
  const getUserFileDetails = async () => {
    const fileList = await getPostsByUserIdExceptAvatar(
      props.subscriber.user_id
    );
    const fileIdList = await fileList.map((file) => {
      return file.file_id;
    });

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
        return file;
      })
    );
    // console.log('FILE LIST', updatedsubscriberFilesOnly);
    setUserFiles(updatedsubscriberFilesOnly);
    setUserFilesLoaded(true);
  };

  useEffect(async () => {
    await getUserFileDetails();
    // console.log('SUBSCRIBER POSTS', userFiles);
    // console.log('SUBSCRIBER POSTS READY', userFilesLoaded);
  }, [userFilesLoaded]);

  // CALCULATE RATINGS FOR POST, if there is no rating return 0 and display unavailable
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
          sum += rating;
          count++;
          if (count === 0) {
            return 0;
          }
          average = sum / count;
        });
        return Math.round((average + Number.EPSILON) * 100) / 100;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          <Text
            style={[
              styles.text,
              styles.username,
              {alignSelf: 'center', paddingBottom: 20, textAlign: 'center'},
            ]}
          >
            User's average rating:{'\n '}
            {props.subscriber.average_rating != 0
              ? props.subscriber.average_rating
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
            <>
              <PlaceholderImage />
            </>
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
    paddingBottom: 15,
    paddingTop: 15,
  },
});

UserInfoModal.propTypes = {
  subscriber: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default UserInfoModal;
