import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Avatar, ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {uploadsUrl} from '../utils/Variables';
import {fetchAvatar} from '../utils/Utils';
import ChatMenuItem from '../components/ChatMenuItem';

const ChatMenu = ({navigation}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
  const {update, setUpdate} = useContext(MainContext);
  const [mediaArray, setMediaArray] = useState([]);
  const {getCommentsForUser, getCommentsForFile} = useComments();
  const {getPostsByUserId, getSingleMedia} = useMedia();
  const {getUserById} = useUser();

  const fetchMedia = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // user´s all comments
      const commentArrayForUser = await getCommentsForUser(userToken);
      // user´s posts to link media
      const usersPosts = await getPostsByUserId(userId);

      const setOfUsers = new Set();
      // get chats to other user´s posts
      const chatsToOtherUsersFiles = commentArrayForUser.filter((item) => {
        const messageJson = JSON.parse(item.comment);
        if (messageJson.chat_starter_id === userId) {
          if (setOfUsers.has(item.user_id)) {
          } else {
            setOfUsers.add(item.user_id);
            return item;
          }
          return item;
        }
      });
      console.log('to others', chatsToOtherUsersFiles);

      // get chats to own posts
      const chatsToUser = await Promise.all(
        usersPosts.map(async (post) => {
          const commentsForFile = await getCommentsForFile(post.file_id);
          commentsForFile.filter((comment) => {
            const messageJson = JSON.parse(comment.comment);
            if (messageJson.chat_responser_id === userId) {
              return comment;
            }
          });
          return commentsForFile;
        })
      );

      const chatsToUserWithoutOwn=chatsToUser.filter(comment=>comment.user_id===userId);

      console.log('testetsttest', chatsToUserWithoutOwn);

      const concatenatedArray = chatsToUser.concat(chatsToOtherUsersFiles);

      const sortedArray = concatenatedArray.sort(
        (a, b) => b.comment_id - a.comment_id
      );
      const flatArray = sortedArray.flat();

      const commentArrayWithMedia = await Promise.all(
        flatArray.map(async (item) => {
          try {
            const mediaFile = await getSingleMedia(item.file_id, userToken);

            item['media_thumbnails'] = mediaFile.thumbnails;
            item['media_title'] = mediaFile.title;

            const userFile = await getUserById(item.user_id, userToken);
            item['username'] = userFile.username;
            //item['avatar'] = uploadsUrl + (await fetchAvatar(item));
            return item;
          } catch (error) {
            console.error('get single media file error');
          }
        })
      );
      setMediaArray(commentArrayWithMedia);
    } catch (error) {
      console.error(' get comments error', error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [update]);

  useEffect(async () => {}, [update]);

  return (
    <View style={styles.container}>
      <FlatList
        data={mediaArray}
        keyExtractor={(item) => item.comment_id}
        renderItem={({item}) => (
          <ChatMenuItem item={item} navigation={navigation} />
        )}
        ListFooterComponent={() => {
          return null;
        }}
      />
    </View>
  );
};

ChatMenu.propTypes = {
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

export default ChatMenu;
