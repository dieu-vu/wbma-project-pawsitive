import React from 'react';
import {Input, Button} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import MainButton from './MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComments} from '../hooks/ApiHooks';

const CommentForm = ({fileId}) => {
  const {postComment} = useComments();

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
    // console.log(data);
    try {
      const formData = new FormData();
      const comment=data.comment;

      console.log(comment);


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
      <Button onPress={handleSubmit(onSubmit)} title="Save" />
    </View>
  );
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
