import React, {useContext, useState} from 'react';
import {Button, Overlay, Card} from 'react-native-elements';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {getFonts} from '../utils/Utils';
import CustomButton from './CustomButton';

const UserInfoModal = (props) => {
  const {userInfoModalVisible, setUserInfoModalVisible} =
    useContext(MainContext);

  getFonts();
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text
          h4
          style={[
            styles.text,
            {textAlign: 'left', fontFamily: 'Montserrat-SemiBold'},
          ]}
        >
          {props.subscriber.username}
        </Text>
      </View>
      <CustomButton
        title="Close"
        fontSize={16}
        onPress={() => {
          setUserInfoModalVisible(!userInfoModalVisible);
        }}
      />
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
  },
});

UserInfoModal.propTypes = {
  subscriber: PropTypes.object.isRequired,
};

export default UserInfoModal;
