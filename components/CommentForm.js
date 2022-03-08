import React, {useContext} from 'react';
import {Input, Button} from 'react-native-elements';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import MainButton from './MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import propTypes from 'prop-types';

const CommentForm = ({fileId, chatStarterId, chatResponserId}) => {
  const {user} = useContext(MainContext);
  const userId = user.user_id;
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
    comment['chat_starter_id'] = chatStarterId;
    comment['chat_responser_id'] = chatResponserId;

    const commentString = JSON.stringify(comment);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.formContainer,
          {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Comment needed'},
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              leftIcon={{type: 'evilicon', name: 'comment', size: 35}}
              inputContainerStyle={styles.inputField}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="..."
              errorMessage={errors.comment && errors.comment.message}
            />
          )}
          name="comment"
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          title="Chat"
          containerStyle={{
            height: 60,
            width: '22%',
            right: 9.5,
          }}
          titleStyle={{
            fontFamily: 'Montserrat-SemiBold',
            color: 'black',
            fontSize: 15,
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

CommentForm.propTypes = {
  fileId: propTypes.number,
  chatStarterId: propTypes.number,
  chatResponserId: propTypes.number,
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 50,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '78%',
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
  },
  buttonStyle: {
    height: 50,
    width: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: '#A9FC73',
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default CommentForm;
