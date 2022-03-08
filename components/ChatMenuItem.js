import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Avatar, Icon, ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, uploadsUrl} from '../utils/Variables';
import {fetchAvatar} from '../utils/Utils';
import {LinearGradient} from 'expo-linear-gradient';

const ChatMenuItem = ({navigation, item}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
  const {update, setUpdate} = useContext(MainContext);

  return (
    <ListItem
      bottomDivider
      ViewComponent={LinearGradient}
      linearGradientProps={{
        colors: ['#8DD35E', '#425E20'],
        start: {x: 0.1, y: 0.3},
        end: {x: 0, y: 0.2},
        borderRadius: 15,
        overflow: 'hidden',
      }}
      style={styles.container}
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
        <Avatar
          size="large"
          rounded={true}
          source={{
            uri: uploadsUrl + item.media_thumbnails.w160,
          }}
        />
        <View style={styles.textContainer}>
          <View style={styles.textItem}>
            <Icon name="mail" type="feather" style={styles.icon} />
            <Text style={styles.text}>{item.media_title}</Text>
          </View>
          <View style={styles.textItem}>
            <Icon name="user" type="feather" style={styles.icon} />
            <Text style={styles.text}>{item.username}</Text>
          </View>
        </View>
      </View>
    </ListItem>
  );
};

ChatMenuItem.propTypes = {
  item: propTypes.object,
  navigation: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.darkestGreen,
    borderRadius: 5,
    backgroundColor: '#8DD35E',
    marginBottom: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
    fontSize: 18,
    paddingHorizontal: 5,
  },
  postContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.55,
  },
  icon: {
    paddingLeft: 10,
  },
  textItem: {
    flexDirection: 'row',
    padding: 7,
  },
});

export default ChatMenuItem;
