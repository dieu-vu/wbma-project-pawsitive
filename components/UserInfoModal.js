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
import {getFonts, fetchAvatar} from '../utils/Utils';
import CustomButton from './CustomButton';
import {uploadsUrl, colors} from '../utils/Variables';
import {useMedia, mediaArray} from '../hooks/ApiHooks';
import UserHistoryListItem from './UserHistoryListItem';
import PlaceholderImage from './PlaceholderImage';

const UserInfoModal = (props) => {
  const {userInfoModalVisible, setUserInfoModalVisible} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState('../assets/user.png');
  const {getPostsByUserIdExceptAvatar, mediaArray} = useMedia();
  const [userFiles, setUserFiles] = useState([]);

  const [userFilesLoaded, setUserFilesLoaded] = useState(false);

  getFonts();

  console.log('USER INFO MODAL', props.subscriber);
  console.log('USER ID MODAL', props.subscriber.user_id);

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
    console.log('FILE LIST', subscriberFilesOnly);
    setUserFiles(subscriberFilesOnly);
    setUserFilesLoaded(true);
  };

  useEffect(async () => {
    await getUserFileDetails();
    // console.log('SUBSCRIBER POSTS', userFiles);
  }, []);

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
          <Image
            source={{uri: avatar}}
            style={styles.avatarImage}
            resizeMode="contain"
          ></Image>
        </View>
        <View>
          <Text h4 style={[styles.text, styles.username]}>
            User's posts
          </Text>
          {/* TODO: Have a list of posts with rating info here */}
        </View>
        <View>
          {userFilesLoaded && userFiles.length > 0 ? (
            // <Text>{userFiles.length} files found</Text>
            <FlatList
              data={userFiles}
              keyExtractor={(item) => item.file_id.toString()}
              renderItem={({item}) => <UserHistoryListItem file={item} />}
              ListFooterComponent={() => {
                return null;
              }}
            />
          ) : userFilesLoaded && userFiles.length == 0 ? (
            <Text style={[styles.text, {alignSelf: 'center'}]}>No media</Text>
          ) : (
            <PlaceholderImage />
          )}
        </View>
        <CustomButton
          title="Close"
          fontSize={16}
          onPress={() => {
            setUserInfoModalVisible(!userInfoModalVisible);
          }}
        />
      </ScrollView>
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
