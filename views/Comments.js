import React, {useContext, useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import propTypes from 'prop-types';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CommentForm from '../components/CommentForm';

const CommentsContainer = ({route}) => {
  const {file} = route.params;
  const [commentsArray, setCommentsArray] = useState([]);
  const {getComments} = useComments();
  const {update, setUpdate} = useContext(MainContext);

  const fetchComments = async () => {
    try {
      console.log(file.file_id);
      const commentList = await getComments(file.file_id);
      const commentFile = commentList[2];
      console.log(commentFile);
      const comment = commentFile.comment;
      console.log(comment);
      const commentJson = JSON.parse(comment);
      const receiver = commentJson.receiver;
      console.log(receiver);

      setCommentsArray(commentList);
    } catch (error) {
      console.error('get comments error', error);
    }
  };

  const CommentItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.comment}</Text>
    </View>
  );
  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={commentsArray}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({item}) => <CommentItem item={item} />}
          ListFooterComponent={() => {
            return null;
          }}
        />
      </View>
      <View style={{bottom: 0}}>
        <CommentForm fileId={file.file_id} />
      </View>
    </View>
  );
};

CommentsContainer.propTypes = {
  navigation: propTypes.object,
  route: propTypes.object,
  item: propTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
  },
  item: {},
  text: {},
});

export default CommentsContainer;
