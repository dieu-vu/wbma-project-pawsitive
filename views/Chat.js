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
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

const Chat = ({route, navigation}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
  const fileId = route.params.fileId;
  const chatStarterId = route.params.chatStarterId;
  console.log('starter', chatStarterId);
  const chatResponserId = route.params.chatResponserId;
  console.log('response', chatResponserId);

  console.log('fileId', fileId);
  console.log('route', route);
  const single = route.params.single;
  let listViewRef;

  const [commentsArray, setCommentsArray] = useState([]);
  const {getCommentsForFile} = useComments();
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
    } catch (error) {
      console.error('get comments error', error);
    }
  };

  const CommentItem = ({item}) => (
    <ListItem
      style={styles.item}
      containerStyle={
        item.user_id === userId
          ? styles.commentContainerLeft
          : styles.commentContainerRight
      }
    >
      <Text style={styles.text}>{JSON.parse(item.comment).comment}</Text>
    </ListItem>
  );

  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <SafeAreaView>
      <View styles={styles.container}>
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.formContainer}>
            <CommentForm
              fileId={fileId}
              chatStarterId={chatStarterId}
              chatResponserId={chatResponserId}
              style={{}}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
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
    padding: 20,
    width: Dimensions.get('window').width * 0.4,
  },
  text: {},
  flatList: {
    height: Dimensions.get('window').height - 165,
  },
  formContainer: {
    height: 50,
    alignSelf: 'flex-end',
  },
  commentContainerLeft: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: '#8DD35E',
    marginTop: 10,
    borderRadius: 10,
  },
  commentContainerRight: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: '#8DD35E',
    marginTop: 10,
    borderRadius: 10,
    left: 120,
    paddingLeft: 20,
  },
});

export default Chat;
