import React, {useContext, useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Alert,
  Pressable,
  TouchableHighlight,
  SafeAreaView,
  Appearance,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Card, Input, Icon, Text} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {pickRandomImage, formatDate, getFonts} from '../utils/Utils';
import CustomButton from '../components/CustomButton';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appId} from '../utils/Variables';

const Upload = ({navigation}) => {
  const [image, setImage] = useState();
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia, loading} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const animation = React.createRef();
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(colorScheme == 'dark');
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      fromTime: '',
      toTime: '',
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
    setValue('fromTime', '');
    setValue('toTime', '');
    setType('image');
    setImage();
    setFromTime();
    setToTime();
    animation.current?.play();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm();
      };
    }, [])
  );
  getFonts();

  useEffect(() => {
    animation.current?.play();
    setIsDark(colorScheme === 'dark');
  }, [animation, colorScheme]);

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
      const token = await AsyncStorage.getItem('userToken');
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
              navigation.navigate('Listing');
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
            onPress={pickImage}
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
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            paddingBottom: insets.bottom,
            flex: 1,
          }}
        >
          <Card style={styles.container}>
            {!image ? (
              <ImageBackground
                source={pickRandomImage()}
                onPress={pickImage}
                style={[styles.image, {opacity: 0.7}]}
              >
                <Pressable onPress={pickImage} style={styles.animation}>
                  <LottieView
                    source={require('../assets/add-button-lottie.json')}
                    ref={animation}
                    style={{width: 150, height: 150, alignSelf: 'center'}}
                    loop={true}
                    autoPlay={true}
                  />
                </Pressable>
              </ImageBackground>
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
                  autoCapitalize="none"
                  placeholder="Title"
                  errorMessage={errors.title && 'This is required'}
                  style={styles.input}
                ></Input>
              )}
              name="title"
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
                  style={styles.input}
                ></Input>
              )}
              name="description"
            ></Controller>

            <View
              style={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Input start date */}
              <Controller
                control={control}
                rules={{require: true}}
                name="fromTime"
                render={({field: {onChange, onBlur, value}}) => (
                  <TouchableHighlight
                    onPress={() => setFromDatePickerVisibility(true)}
                    activeOpacity={0.3}
                    underlayColor="#A9FC73"
                    onBlur={onBlur}
                    onChange={onChange}
                    style={styles.calendarBox}
                  >
                    <View
                      style={{
                        flexGrow: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Text style={[styles.text, {marginRight: 2, width: 50}]}>
                        {' '}
                        From{' '}
                      </Text>
                      <Icon name="calendar" type="feather"></Icon>
                      <DateTimePickerModal
                        isVisible={isFromDatePickerVisible}
                        mode="datetime"
                        isDarkModeEnabled={isDark}
                        themeVariant={isDark ? 'dark' : 'light'}
                        onConfirm={(date) => {
                          console.log('type', typeof date);
                          const formattedDate = formatDate(date);
                          value = date;
                          setFromDatePickerVisibility(false);
                          setFromTime(formattedDate);
                          console.log('from date picked', value);
                        }}
                        onCancel={() => setFromDatePickerVisibility(false)}
                      />
                      <Text style={[styles.text, {marginLeft: 10}]}>
                        {!fromTime ? 'Pick date' : fromTime}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              ></Controller>

              {/* Input end time */}
              <Controller
                control={control}
                rules={{require: true}}
                name="toTime"
                render={({field: {onChange, onBlur, value}}) => (
                  <TouchableHighlight
                    onPress={() => setToDatePickerVisibility(true)}
                    activeOpacity={0.3}
                    underlayColor="#A9FC73"
                    onBlur={onBlur}
                    onChange={onChange}
                    style={styles.calendarBox}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Text style={[styles.text, {marginRight: 2, width: 50}]}>
                        {' '}
                        To{' '}
                      </Text>
                      <Icon name="calendar" type="feather"></Icon>
                      <DateTimePickerModal
                        isVisible={isToDatePickerVisible}
                        isDarkModeEnabled={isDark}
                        themeVariant={isDark ? 'dark' : 'light'}
                        mode="datetime"
                        onConfirm={(date) => {
                          value = date;
                          const formattedDate = formatDate(date);
                          setToDatePickerVisibility(false);
                          setToTime(formattedDate);
                          console.log('to date picked', value);
                        }}
                        onCancel={() => setToDatePickerVisibility(false)}
                      />
                      <Text style={[styles.text, {marginLeft: 10}]}>
                        {!toTime ? 'Pick date' : toTime}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              ></Controller>
            </View>

            <CustomButton
              disabled={!imageSelected}
              loading={loading}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#9DCD5A',
    alignSelf: 'center',
    width: '60%',
    height: undefined,
  },
  buttonTitle: {
    color: 'black',
    fontSize: 20,
  },
  pressArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
    zIndex: 1,
  },
  calendarBox: {width: '50%', alignSelf: 'flex-start', margin: 10},
  input: {
    fontFamily: 'Montserrat-Regular',
    paddingBottom: 5,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
