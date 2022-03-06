import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';

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
      setCommentsArray(mappedCommentsList);
    } catch (error) {
      console.error('get comments error', error);
    }
  };

  const CommentItem = ({item}) => (
    <ListItem style={styles.item}>
      <Text style={styles.text}>{JSON.parse(item.comment).comment}</Text>
    </ListItem>
  );

  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={commentsArray}
          keyExtractor={(item) => item.comment_id}
          renderItem={({item}) => <CommentItem item={item} />}
          ListFooterComponent={() => {
            return null;
          }}
        />
        <View style={{bottom: 0}}>
          <CommentForm
            fileId={fileId}
            chatStarterId={chatStarterId}
            chatResponserId={chatResponserId}
            style={{height: 200}}
          />
        </View>
      </View>
    </View>
  );
};

Chat.propTypes = {
  navigation: propTypes.object,
  route: propTypes.object,
  item: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
  },
  item: {
    padding: 20,
    width: Dimensions.get('window').width * 0.4,
  },
  text: {},
  commentContainer: {},
});

export default Chat;
