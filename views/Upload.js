import React, {useContext, useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, ScrollView, View, Image, Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Text, Card, Button, Input} from 'react-native-elements';
import DefaultImage from '../assets/upload-green.png';
import CustomButton from '../components/CustomButton';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appId} from '../utils/Variables';

const Upload = ({navigation}) => {
  // const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const [image, setImage] = useState();
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia, loading} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const animation = React.createRef();

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

  // TODO: add calendar for time and add location from map

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    console.log('selected image info: ', result);
    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  // TODO: if possible, get camera permission to film a video constantly
  const resetForm = () => {
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
    setType('image');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [])
  );

  useEffect(() => {
    animation.current?.play();
  }, []);

  const onSubmit = async (data) => {
    if (!imageSelected) {
      Alert.alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    try {
      // const token = await AsyncStorage.getItem('userToken');
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNiwidXNlcm5hbWUiOiJkaWV1diIsImVtYWlsIjoiZGlldXZAbWV0cm9wb2xpYS5maSIsImZ1bGxfbmFtZSI6IkRpZXUgVnUiLCJpc19hZG1pbiI6bnVsbCwidGltZV9jcmVhdGVkIjoiMjAyMi0wMS0xMFQxMzozOToyMC4wMDBaIiwiaWF0IjoxNjQ0ODY4ODk5LCJleHAiOjE2NDQ5NTUyOTl9.y7SwF0LJxChNRzThYh1xSgvNXchnBAtc4FGw8zt7GnE';
      const response = await postMedia(formData, token);
      console.log('Upload response', response);

      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
      );
      tagResponse &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Home');
            },
          },
        ]);
    } catch (error) {
      console.log('onSubmit Upload file error', error.errorMessage);
    }
  };

  const displayMedia = (type) => {
    return (
      <>
        {type === 'image' ? (
          <Card.Image
            source={{uri: image}}
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
      </>
    );
  };

  return (
    <>
      <ScrollView>
        <Card style={styles.container}>
          {!image ? (
            <LottieView
              source={require('../assets/add-button-lottie.json')}
              ref={animation}
              style={styles.animation}
              loop={true}
            />
          ) : (
            displayMedia(type)
          )}
          <Controller
  control={control}
  rules={{require: true}}
  render={({field: {onChange, onBlur, value}}) => (
    <Input
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      autoCapitalize='none'
      placeholder='Title'
      errorMessage={errors.title && 'This is required'}
    ></Input>
  )}
  name='title'
  />

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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
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
  animation: {
    width: '50%',
    height: undefined,
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
