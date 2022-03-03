import React, {useContext} from 'react';
import {Input, Button} from 'react-native-elements';
import {Alert, StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import MainButton from './MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import propTypes from 'prop-types';
import CommentsContainer from '../views/Comments';

const CommentForm = ({fileId, commentCreator}) => {
  const {postComment} = useComments();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      comment: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    const comment = {};
    comment['comment'] = data.comment;
    comment['creator'] = commentCreator;

    const commentString=JSON.stringify(comment);

    const jsonData = {};
    jsonData['file_id'] = fileId;
    jsonData['comment'] = commentString;

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postComment(jsonData, token);
      response && setUpdate(update + 1);
    } catch (error) {
      console.error('posting comment error', error);
    }
  };
  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Comment needed'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            leftIcon={{type: 'evilicon', name: 'user', size: 40}}
            inputContainerStyle={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Message..."
            errorMessage={errors.comment && errors.comment.message}
          />
        )}
        name="comment"
      />
      <Button
        onPress={handleSubmit(onSubmit)}
        title="Save"
        containerStyle={{height: 80, width: 100}}
      />
    </View>
  );
};

CommentForm.propTypes = {
  fileId: propTypes.number,
  commentCreator: propTypes.number,
};

const styles = StyleSheet.create({
  inputField: {
    alignSelf: 'center',
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 10,
    height: 50,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
  },
});

export default CommentForm;
