import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import propTypes from 'prop-types';
import {useComments, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatMenuItem from '../components/ChatMenuItem';
import {getFonts} from '../utils/Utils';

const ChatMenu = ({navigation}) => {
  const [mediaArray, setMediaArray] = useState([]);

  const {user} = useContext(MainContext);
  const {update} = useContext(MainContext);
  const {getCommentsForUser, getCommentsForFile} = useComments();
  const {getPostsByUserId, getSingleMedia} = useMedia();
  const {getUserById} = useUser();

  const userId = user.user_id;

  getFonts();

  const fetchMedia = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      // get all comments for user
      const commentArrayForUser = await getCommentsForUser(userToken);

      const arrayOfPosts = [];
      // get chats to other user´s posts
      const chatsToOtherUsersFiles = commentArrayForUser.filter((item) => {
        /* Check if the comment has the chat starter id in the string, if true then parse Json
           (not the best way but at least work in this case, will be still crashed if someone comment with this string) */
        let messageJson = {};
        if (item.comment.includes('chat_starter_id')) {
          messageJson = JSON.parse(item.comment);
          if (messageJson && messageJson.chat_starter_id === userId) {
            if (!arrayOfPosts.includes(item.file_id)) {
              arrayOfPosts.push(item.file_id);
              return item;
            }
          }
        }
      });

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

      // leave only one comment/chat to represent the chat in the menu
      const chatsToUserWithoutDuplicates = chatsToUser.map((item) => {
        const userIdArray = [];
        return item.filter((item) => {
          if (!userIdArray.includes(item.user_id)) {
            userIdArray.push(item.user_id);
            return item;
          }
        });
      });

      // flatten the nested arrays into one array
      const flatChatsToUser = chatsToUserWithoutDuplicates.flat();

      // remove user´s own comments
      const chatsToUserWithoutOwn = flatChatsToUser.filter(
        (comment) => comment.user_id !== userId
      );

      // concatenate the two arrays
      const concatenatedArray = chatsToUserWithoutOwn.concat(
        chatsToOtherUsersFiles
      );

      // reverse the order of the array
      const sortedArray = concatenatedArray.sort(
        (a, b) => b.comment_id - a.comment_id
      );

      // add media needed to the comment items
      const commentArrayWithMedia = await Promise.all(
        sortedArray.map(async (item) => {
          try {
            const mediaFile = await getSingleMedia(item.file_id, userToken);

            item['media_thumbnails'] = mediaFile.thumbnails;
            item['media_title'] = mediaFile.title;

            const userFile = await getUserById(item.user_id, userToken);
            item['username'] = userFile.username;
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
