import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, Image} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Text, Card, Button, Input} from 'react-native-elements';
import DefaultImage from '../assets/upload-green.png';
import CustomButton from '../components/CustomButton';

const Upload = ({navigation}) => {
  const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const [image, setImage] = useState();
  const [type, setType] = useState('image');
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  });

  const pickImage = () => {};
  const onSubmit = () => {};
  const resetForm = () => {};

  console.log('image', image);
  return (
    <>
      <ScrollView>
        <Card>
          {type === 'image' ? (
            <Card.Image
              source={!image ? {uri: DEFAULT_IMAGE} : {uri: image}}
              style={styles.image}
              // onPress={pickImage}
            ></Card.Image>
          ) : (
            <Video
              source={{uri: image}}
              style={styles.image}
              useNativeControls={true}
              resizeMode="cover"
              onError={(err) => {
                console.log('Video error', err);
              }}
            ></Video>
          )}
          <Controller
            control={control}
            rules={{require: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Title"
                errorMessage={errors.title && 'This is required'}
              ></Input>
            )}
            name="title"
          ></Controller>

          <Controller
            control={control}
            rules={{require: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Description"
                errorMessage={errors.description && 'This is required'}
              ></Input>
            )}
            name="description"
          ></Controller>
          <CustomButton
            title={'Choose image'}
            onPress={pickImage}
            fontSize={14}
          />
          <CustomButton
            // disabled={!imageSelected}
            // loading={loading}
            buttonStyle={styles.button}
            title="Upload"
            titleStyle={styles.buttonTitle}
            onPress={handleSubmit(onSubmit)}
          />
          <CustomButton
            title="Reset form"
            onPress={resetForm}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: 50,
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#9DCD5A',
    alignSelf: 'center',
    width: '60%',
  },
  buttonTitle: {
    color: 'black',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
