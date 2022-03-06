import React, {useContext, useState, useEffect} from 'react';
import {Button, Overlay, Card, Avatar, Text} from 'react-native-elements';
import {StyleSheet, Dimensions, View, Image, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {getFonts, fetchAvatar} from '../utils/Utils';
import CustomButton from './CustomButton';
import {uploadsUrl, colors} from '../utils/Variables';
import List from '../components/List';

const UserInfoModal = (props) => {
  const {userInfoModalVisible, setUserInfoModalVisible} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState('../assets/user.png');

  getFonts();
  useEffect(async () => {
    const avatarFile = await fetchAvatar(props.subscriber);
    setAvatar(uploadsUrl + avatarFile);
  }, []);

  console.log('USER INFO MODAL', props.subscriber);
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
