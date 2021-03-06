import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl, colors} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';
import {MainContext} from '../contexts/MainContext';
import {fetchAvatar} from '../utils/Utils';
import CustomButton from './CustomButton';

// TODO: change description for all file in listing
const UserListItem = ({navigation, subscriber}) => {
  const {
    setUserInfoModalVisible,
    setViewedSubscriber,
    user,
    currentViewedFile,
  } = useContext(MainContext);
  const [avatar, setAvatar] = useState('../assets/user.svg');

  useEffect(async () => {
    const avatarFile = await fetchAvatar(subscriber);
    setAvatar(uploadsUrl + avatarFile);
    // console.log('CURRENT VIEWED FILE IN LIST', currentViewedFile);
  }, []);

  return (
    <ListItem
      bottomDivider
      style={styles.listItem}
      Component={TouchableOpacity}
      linearGradientProps={{
        colors: ['white', colors.headerGreen],
        start: {x: 0.1, y: 0.6},
        end: {x: 0, y: 0.2},
      }}
      containerStyle={{borderColor: colors.darkestGreen, borderWidth: 0.5}}
      ViewComponent={LinearGradient}
      onPress={() => {
        setUserInfoModalVisible(true);
        setViewedSubscriber(subscriber);
      }}
    >
      <Avatar
        size="large"
        rounded={true}
        source={{
          uri: avatar,
        }}
      />
      <ListItem.Content style={styles.itemContent}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <ListItem.Title numberOfLines={1} style={styles.title}>
            {subscriber.username}
          </ListItem.Title>
          <ListItem.Title numberOfLines={1} style={styles.rating}>
            Average rating: {subscriber.average_rating}
          </ListItem.Title>
          <View style={{flex: 1, flexDirection: 'row', width: '90%'}}>
            <CustomButton
              title="View"
              fontSize={14}
              customWidth={'90%'}
              // onPress open UserInfoModal
              onPress={() => {
                setUserInfoModalVisible(true);
                setViewedSubscriber(subscriber);
              }}
            ></CustomButton>
            <CustomButton
              title="Chat"
              fontSize={14}
              customWidth={'90%'}
              //  onPress open chat with subscriber
              onPress={() => {
                navigation.navigate('Chat', {
                  fileId: currentViewedFile,
                  chatStarterId: user.user_id,
                  chatResponserId: subscriber.user_id,
                  single: true,
                });
              }}
            ></CustomButton>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#8DD35E',
    marginBottom: 5,
    marginTop: 5,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 20,
    padding: 10,
  },
  rating: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    paddingBottom: 20,
    paddingLeft: 10,
  },

  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

UserListItem.propTypes = {
  subscriber: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default UserListItem;
