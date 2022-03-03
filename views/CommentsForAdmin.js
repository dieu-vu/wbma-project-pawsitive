import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';

const CommentsForAdmin = ({route, navigation}) => {
  const {user} = useContext(MainContext);
  const {update, setUpdate} = useContext(MainContext);
  const [commentsArray, setCommentsArray] = useState([]);
  const {getComments} = useComments();
  const fileId = route.params.fileId.fileId;
  const fileUserId = route.params.fileUserId.item;
  console.log('route', route);

  const fetchComments = async () => {
    try {
      console.log('file user', fileUserId);
      const commentList = await getComments(fileId);

      console.log(commentList);

      const mappedCommentsList = commentList.filter((item) =>{
        const comment = JSON.parse(item.comment);
        const chatStarter = comment.creator;
        if (item.user_id === fileUserId) {
          return item;
        } else if (chatStarter === fileUserId) {
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
      containerStyle={
        JSON.parse(item.comment).creator === 0
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
    <View style={styles.container}>
      <View>
        <FlatList
          data={commentsArray}
          keyExtractor={(item) => item.comment_id.toString}
          renderItem={({item}) => <CommentItem item={item} />}
          ListFooterComponent={() => {
            return null;
          }}
        />
        <View style={{bottom: 0}}>
          <CommentForm
            fileId={fileId}
            commentCreator={fileUserId}
            style={{height: 200}}
          />
        </View>
      </View>
    </View>
  );
};

CommentsForAdmin.propTypes = {
  navigation: propTypes.object,
  route: propTypes.object,
  item: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
  },
  commentContainerLeft: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: '#8DD35E',
    marginTop: 20,
    borderRadius: 10,
    left: 10,
    marginLeft: 10,
  },
  commentContainerRight: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: '#8DD35E',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 15,
  },
});

export default CommentsForAdmin;
