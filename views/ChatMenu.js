import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import propTypes from 'prop-types';
import {useComments, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

      const arrayOfPosts = [];
      // get chats to other user´s posts
      const chatsToOtherUsersFiles = commentArrayForUser.filter((item) => {
        const messageJson = JSON.parse(item.comment);
        if (messageJson.chat_starter_id === userId) {
          if (!arrayOfPosts.includes(item.file_id)) {
            arrayOfPosts.push(item.file_id);
            return item;
          }
        }
      });
      console.log('to others', chatsToOtherUsersFiles);

      // user´s posts to link media
      const usersPosts = await getPostsByUserId(userId);

      // get chats to own posts
      const chatsToUser = await Promise.all(
        usersPosts.map(async (post) => {
          try {
            return await getCommentsForFile(post.file_id);
          } catch (error) {
            console.log('get comment error', error);
          }
        })
      );

      // need a function to clear duplicate users from a list of comments

      const chatsToUserWithoutDuplicates = chatsToUser.map((item) => {
        const userIdArray = [];
        return item.filter((item) => {
          console.log(typeof item.user_id);
          if (!userIdArray.includes(item.user_id)) {
            userIdArray.push(item.user_id);
            return item;
          }
        });
      });

      console.log(chatsToUserWithoutDuplicates);

      const flatChatsToUser = chatsToUserWithoutDuplicates.flat();

      const chatsToUserWithoutOwn = flatChatsToUser.filter(
        (comment) => comment.user_id !== userId
      );

      const concatenatedArray = chatsToUserWithoutOwn.concat(
        chatsToOtherUsersFiles
      );

      const sortedArray = concatenatedArray.sort(
        (a, b) => b.comment_id - a.comment_id
      );

      const commentArrayWithMedia = await Promise.all(
        sortedArray.map(async (item) => {
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
      console.log(commentArrayWithMedia);
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
        style={{paddingHorizontal: 10, paddingTop: 5}}
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
