import React, {useContext, useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  Platform,
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
import {Card, Input, Icon, Text, FAB} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {pickRandomImage, formatDate, getFonts} from '../utils/Utils';
import CustomButton from '../components/CustomButton';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appId, colors} from '../utils/Variables';
import CheckBoxComponent from '../components/CheckBoxComponent';
import CustomDropDownPicker from '../components/DropDownPicker';
import MapOverlayComponent from '../components/MapOverlayComponent';
import {onChange} from 'react-native-reanimated';
import PlaceholderImage from '../components/PlaceholderImage';

const Upload = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const animation = React.createRef();

  const [image, setImage] = useState();
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia, loading} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {postTag} = useTag();
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(colorScheme == 'dark');
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const {userType} = useContext(MainContext);
  const {petType} = useContext(MainContext);
  const {mapOverlayVisible, setMapOverlayVisible} = useContext(MainContext);
  const {postLocation, currentUserLocation, setPostLocation} =
    useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      price: '',
    },
    mode: 'onBlur',
  });

  // Pick image from device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    // console.log('selected image info: ', result);
    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  const resetForm = () => {
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
    setValue('startTime', '');
    setValue('endTime', '');
    setValue('price', '');

    setType('image');
    setImage();
    setStartTime();
    setEndTime();
    setPostLocation('');
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

  const createJsonString = (data) => {
    const json = {};
    json['description'] = data.description;
    json['start_time'] = data.startTime;

    json['price'] = data.price;
    json['end_time'] = data.endTime;
    if (data.startTime > data.endTime) {
      Alert.alert('End time must be after Start time');
      return;
    }

    postLocation
      ? (json['coords'] = postLocation)
      : (json['coords'] = currentUserLocation);
    json['price'] = data.price.trim();

    return JSON.stringify(json);
  };

  const onSubmit = async (data) => {
    // force the upload to have info of pet type and location
    if (!petType) {
      Alert.alert('Please select a pet type');
      return;
    }
    if (!postLocation) {
      Alert.alert('Please provide location');
      return;
    }

    if (!imageSelected) {
      Alert.alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('title', data.title);

    const fileInfoJson = createJsonString(data);

    if (!fileInfoJson) {
      return;
    }

    formData.append('description', fileInfoJson);

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

      // reset postLocation in global context so the descriptive text can be reset properly
      setPostLocation('');

      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
      );

      // Add the user type to tag pawsitive_user_[user type as owner or sitter]
      const userTypeTag = await postTag(
        {file_id: response.file_id, tag: `${appId}_user_${userType}`},
        token
      );

      // Add pet type to a tag for filtering
      const petTypeTag = await postTag(
        {file_id: response.file_id, tag: `${appId}_pet_${petType}`},
        token
      );

      tagResponse &&
        userTypeTag &&
        petTypeTag &&
        Alert.alert('File', 'Succesfully uploaded', [
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
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            paddingBottom: insets.bottom,
            flex: 1,
          }}
          keyboardShouldPersistTaps="handled"
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
            {loading ? <PlaceholderImage /> : <></>}
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
                  style={[
                    styles.input,
                    {height: 100, textAlignVertical: 'top'},
                  ]}
                  multiline={true}
                ></Input>
              )}
              name="description"
            ></Controller>
            <Controller
              control={control}
              rules={{
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/g,
                  message: 'Must be a number',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  placeholder="Price in EUR"
                  style={[styles.input]}
                  errorMessage={errors.price && 'Please provide a number'}
                ></Input>
              )}
              name="price"
            ></Controller>

            <View keyboardShouldPersistTaps="handled">
              <FAB
                visible={true}
                title="Add location"
                upperCase={false}
                size="small"
                icon={{name: 'place', color: 'black'}}
                onPress={() => {
                  setMapOverlayVisible(!mapOverlayVisible);
                }}
                color={colors.brightButtonGreen}
                style={{padding: 15}}
                titleStyle={[styles.text, {color: 'black'}]}
              />
              {mapOverlayVisible ? (
                <MapOverlayComponent isVisible={onChange} />
              ) : (
                <></>
              )}
              {postLocation ? (
                <Text style={styles.addressText}>
                  Selected address: {postLocation.address}
                </Text>
              ) : (
                <Text style={styles.addressText}>
                  Address text not yet provided
                </Text>
              )}
            </View>

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
                name="startTime"
                render={({field: {onChange, onBlur, value}}) => (
                  <TouchableHighlight
                    onPress={() => setFromDatePickerVisibility(true)}
                    activeOpacity={0.3}
                    underlayColor="#A9FC73"
                    onBlur={onBlur}
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
                        From
                      </Text>
                      <Icon name="calendar" type="feather"></Icon>
                      <DateTimePickerModal
                        isVisible={isFromDatePickerVisible}
                        isDarkModeEnabled={isDark}
                        themeVariant={isDark ? 'dark' : 'light'}
                        mode="datetime"
                        onChange={onChange}
                        onConfirm={(date) => {
                          !date ? Date.now() : date;
                          setFromDatePickerVisibility(false);
                          setStartTime(date);
                          date = {value};
                        }}
                        onCancel={() => setFromDatePickerVisibility(false)}
                      />
                      <Text style={[styles.text, {marginLeft: 10}]}>
                        {!startTime ? 'Pick date' : formatDate(startTime)}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              />

              {/* Input end time */}
              <Controller
                control={control}
                rules={{require: true}}
                name="endTime"
                render={({field: {onChange, onBlur, value}}) => (
                  <TouchableHighlight
                    onPress={() => setToDatePickerVisibility(true)}
                    activeOpacity={0.3}
                    underlayColor="#A9FC73"
                    onBlur={onBlur}
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
                        To
                      </Text>
                      <Icon name="calendar" type="feather"></Icon>
                      <DateTimePickerModal
                        isVisible={isToDatePickerVisible}
                        isDarkModeEnabled={isDark}
                        themeVariant={isDark ? 'dark' : 'light'}
                        mode="datetime"
                        onChange={onChange}
                        onConfirm={(date) => {
                          !date ? Date.now() : date;
                          setToDatePickerVisibility(false);
                          setEndTime(date);
                          date = {value};
                        }}
                        onCancel={() => setToDatePickerVisibility(false)}
                      />
                      <Text style={[styles.text, {marginLeft: 10}]}>
                        {!endTime ? 'Pick date' : formatDate(endTime)}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              />
            </View>
            <View>
              <CustomDropDownPicker></CustomDropDownPicker>
            </View>
            <CheckBoxComponent customText="Post as: "></CheckBoxComponent>
            <CustomButton
              disabled={!imageSelected}
              loading={loading}
              buttonStyle={styles.button}
              title="Upload"
              fontSize={18}
              titleStyle={styles.buttonTitle}
              onPress={handleSubmit(onSubmit)}
            />
            <CustomButton
              title="Reset form"
              fontSize={18}
              onPress={resetForm}
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
            />
          </Card>
        </View>
      </KeyboardAwareScrollView>
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
  addressText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    alignSelf: 'center',
    marginBottom: 15,
    textAlign: 'center',
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
    backgroundColor: colors.darkerBackgroundGreen,
    alignSelf: 'center',
    width: '60%',
    height: undefined,
  },
  buttonTitle: {
    color: 'black',
    padding: 5,
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
