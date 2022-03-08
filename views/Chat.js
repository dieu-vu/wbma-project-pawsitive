import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';
import {getFonts} from '../utils/Utils';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../utils/Variables';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({route, navigation}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
  const fileId = route.params.fileId;
  const chatStarterId = route.params.chatStarterId;
  const [chatStarterName, setChatStarterName] = useState();
  const [chatResponserName, setChatResponserName] = useState();
  console.log('starter', chatStarterId);
  const chatResponserId = route.params.chatResponserId;
  console.log('response', chatResponserId);

  getFonts();
  console.log('fileId', fileId);
  console.log('route', route);

  const [commentsArray, setCommentsArray] = useState([]);
  const {getCommentsForFile} = useComments();
  const {getUserById} = useUser();
  const {update, setUpdate} = useContext(MainContext);


  const fetchComments = async () => {
    try {
      const commentList = await getCommentsForFile(fileId);
      const mappedCommentsList = commentList.filter((item) => {
        const comment = JSON.parse(item.comment);
        const starter = comment.chat_starter_id;
        const responser = comment.chat_responser_id;

        if (responser === chatResponserId && starter === chatStarterId) {
          return item;
        }
      });
      console.log(mappedCommentsList);
      setCommentsArray(mappedCommentsList);

      const userToken = await AsyncStorage.getItem('userToken');

      const starter = await fetchUserName(chatStarterId, userToken);

      setChatStarterName(starter);
      const responser = await fetchUserName(chatResponserId, userToken);

      setChatResponserName(responser);
    } catch (error) {
      console.error('get comments error', error);
    }
  };

  const fetchUserName = async (userId, userToken) => {
    try {
      const user = await getUserById(userId, userToken);
      return user.username;
    } catch (error) {
      console.error('get username error', error);
    }
  };

  const CommentItem = ({item}) => (
    <ListItem
      style={styles.item}
      containerStyle={
        item.user_id === JSON.parse(item.comment).chat_starter_id
          ? styles.commentContainerLeft
          : styles.commentContainerRight
      }
    >
      {item.user_id === JSON.parse(item.comment).chat_starter_id ? (
        <Text style={styles.name}>{chatStarterName}</Text>
      ) : (
        <Text style={styles.name}>{chatResponserName}</Text>
      )}
      <Text style={styles.text}>{JSON.parse(item.comment).comment}</Text>
    </ListItem>
  );

  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <SafeAreaView styles={styles.container}>
      <FlatList
        style={styles.flatList}
        data={commentsArray}
        keyExtractor={(item) => item.comment_id}
        renderItem={({item}) => <CommentItem item={item} />}
        ListFooterComponent={() => {
          return null;
        }}
      />
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{flex: 2}}
      >
        <View style={styles.formContainer}>
          <CommentForm
            fileId={fileId}
            chatStarterId={chatStarterId}
            chatResponserId={chatResponserId}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

Chat.propTypes = {
  navigation: propTypes.object,
  route: propTypes.object,
  item: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    width: Dimensions.get('window').width * 0.4,
  },
  text: {
    fontFamily: 'Montserrat-Regular', fontSize: 14
  },
  flatList: {
    height: Dimensions.get('window').height - 165,
    paddingTop: 20,
  },
  formContainer: {
    height: undefined,
    alignSelf: 'flex-end',
  },
  commentContainerLeft: {
    width: Dimensions.get('window').width * 0.5,
    backgroundColor: colors.headerGreen,
    marginTop: 5,
    borderRadius: 10,
  },
  commentContainerRight: {
    width: Dimensions.get('window').width * 0.5,
    backgroundColor: colors.brightButtonGreen,
    marginTop: 5,
    borderRadius: 10,
    left: Dimensions.get('window').width * 0.45,
    paddingLeft: 20,
  },
  name: {
    fontFamily: 'Montserrat-SemiBold',
    bottom: 35,
    right: 10,
  },
});

export default Chat;
