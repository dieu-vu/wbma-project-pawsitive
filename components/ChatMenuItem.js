import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Avatar, ListItem, Text} from 'react-native-elements';
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
      <Text style={styles.text}>{item.username}:</Text>
      <Avatar
        size="small"
        rounded={true}
        source={{
          uri: uploadsUrl + item.media_thumbnails.w160,
        }}
      />
      <Text style={styles.text}>{item.media_title}</Text>
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
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 15,
  },
});

export default ChatMenuItem;
