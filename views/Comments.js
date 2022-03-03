import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';

const Comments = ({route, navigation}) => {
  const {user} = useContext(MainContext);
  const userId=user.user_id;
  const {file} = route.params;
  const fileUserId=file.user_id;

  const fileId=file.file_id;
  const [commentsArray, setCommentsArray] = useState([]);
  const [userArray, setUserArray] = useState([]);
  const {getComments} = useComments();
  const {update, setUpdate} = useContext(MainContext);


  const fetchComments = async () => {
    try {
      const commentList = await getComments(fileId);
      console.log('list for mapping', commentList);
      const mappedCommentsList = commentList.filter((item) =>{
        const comment = JSON.parse(item.comment);
        console.log('chat starter', comment);
        const chatStarter = comment.creator;
        console.log('chat starter', chatStarter);
        console.log('userId', userId);
        if (item.user_id === userId) {
          return item;
        } else if (chatStarter === userId) {
          return item;
        }
      });

      console.log('mapped list', mappedCommentsList)
      setCommentsArray(mappedCommentsList);

      const userSet = new Set();
      commentList.map((item) => {
        const itemUser=item.user_id;
        if (userId !== itemUser) {
          userSet.add(itemUser);
        }
      });
      const userList = Array.from(userSet);
      setUserArray(userList);

    } catch (error) {
      console.error('get comments error', error);
    }
  };

  const CommentItem = ({item}) => (
    <ListItem
      style={styles.item}>
      <Text style={styles.text}>{JSON.parse(item.comment).comment}</Text>
    </ListItem>
  );

  const CommentUserItem = ({item}) => (
    <ListItem
      containerStyle={styles.commentContainer}
      style={styles.item}
      onPress={() => {
        navigation.navigate('Comments admin', {
          fileUserId: {item},
          fileId: {fileId},
        });
      }}
    >
      <Text style={styles.text}>{item.toString()}</Text>
    </ListItem>
  );

  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <View style={styles.container}>
      {user.user_id === file.user_id ? (
        <View>
          <FlatList
            data={userArray}
            keyExtractor={(item) => item}
            renderItem={({item}) => <CommentUserItem item={item} />}
            ListFooterComponent={() => {
              return null;
            }}
          />
        </View>
      ) : (
        <View>
          <FlatList
            data={commentsArray}
            keyExtractor={(item) => item.comment_id.toString()}
            renderItem={({item}) => <CommentItem item={item} />}
            ListFooterComponent={() => {
              return null;
            }}
          />
          <View style={{bottom: 0}}>
            <CommentForm
              fileId={file.file_id}
              commentCreator={0}
              style={{height: 200}}
            />
          </View>
        </View>
      )}
    </View>
  );
};

Comments.propTypes = {
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
  text: {

  },
  commentContainer: {

  },
});

export default Comments;
