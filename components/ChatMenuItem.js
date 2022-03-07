import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Avatar, Icon, ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uploadsUrl} from '../utils/Variables';
import {fetchAvatar} from '../utils/Utils';

const ChatMenuItem = ({navigation, item}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
  const {update, setUpdate} = useContext(MainContext);

  return (
    <ListItem
      containerStyle={styles.container}
      onPress={() => {
        navigation.navigate('Chat', {
          fileId: item.file_id,
          chatStarterId: JSON.parse(item.comment).chat_starter_id,
          chatResponserId: JSON.parse(item.comment).chat_responser_id,
          single: false,
        });
      }}
    >
      <View style={styles.postContainer}>
        <Icon name="user" type="feather" style={styles.icon}/>
        <Text style={styles.text}>{item.username}</Text>
        <Icon name="mail" type="feather" style={styles.icon}/>
        <Text style={styles.text}>{item.media_title}</Text>
      </View>
      <Avatar
        containerStyle={{alignSelf: 'flex-end'}}
        size={50}
        rounded={true}
        source={{
          uri: uploadsUrl + item.media_thumbnails.w160,
        }}
      />
    </ListItem>
  );
};

ChatMenuItem.propTypes = {
  item: propTypes.object,
  navigation: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    margin: 20,
    borderWidth: 3,
    borderColor: '#8DD35E',
    borderRadius: 15,
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  postContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.55,
  },
  icon: {
    paddingLeft: 10,
  },
});

export default ChatMenuItem;
