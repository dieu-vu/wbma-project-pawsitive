import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Alert,
  TouchableHighlight,
  SafeAreaView,
  Appearance,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {Card, Input, Icon, Text, FAB} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {formatDate, getFonts, getMediaCurrentCategoryTag} from '../utils/Utils';
import CustomButton from '../components/CustomButton';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appId, colors} from '../utils/Variables';
import CheckBoxComponent from '../components/CheckBoxComponent';
import CustomDropDownPicker from '../components/DropDownPicker';
import MapOverlayComponent from '../components/MapOverlayComponent';
import {onChange} from 'react-native-reanimated';

const EditPost = ({navigation, route}) => {
  const {file} = route.params;
  const fileInfo = JSON.parse(file.description);
  const insets = useSafeAreaInsets();
  const animation = React.createRef();

  const {putMedia, loading} = useMedia();
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
  const {petType, setPetType} = useContext(MainContext);
  const {mapOverlayVisible, setMapOverlayVisible} = useContext(MainContext);
  const {postLocation} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: fileInfo.description,
      startTime: fileInfo.start_time,
      endTime: fileInfo.end_time,
    },
    mode: 'onBlur',
  });

  getFonts();

  useEffect(() => {
    animation.current?.play();
    setIsDark(colorScheme === 'dark');
  }, [animation, colorScheme]);

  useEffect(() => {
    console.log('user type', userType);
    console.log('pet type', petType);
  }, [petType, userType]);

  const createJsonString = (data) => {
    const json = {};
    json['description'] = data.description;
    json['start_time'] = data.startTime;

    json['end_time'] = data.endTime;
    json['coords'] = postLocation;
    // TODO: to add more field here for subsribers, etc
    return JSON.stringify(json);
  };

  const onSubmit = async (data) => {
    if (!petType) {
      Alert.alert('Please select a pet type');
      return;
    }

    console.log(data);
    const fileInfoJson = createJsonString(data);
    const currentPetType = await getMediaCurrentCategoryTag(file, 'pet');
    const currentUserType = await getMediaCurrentCategoryTag(file, 'user');

    const putData = {};
    putData['title'] = data.title;
    putData['description'] = fileInfoJson;
    console.log('PUT DATA', putData);
    console.log('current pet type', currentPetType);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(putData, token, file.file_id);
      console.log('EDIT POST response', response);

      // Post tag if user type changed from the latest useType Tag:
      let userTypeTag;
      if (currentUserType !== userType) {
        userTypeTag = await postTag(
          {file_id: file.file_id, tag: `${appId}_user_${userType}`},
          token
        );
        console.log('EDIT USER TYPE RESPONSE', userTypeTag);
      }

      // Post tag if pet type changed from the latest petType Tag:
      let petTypeTag;
      console.log('PET TYPE', petType);

      if (currentPetType !== petType) {
        // we should remove old petType tag, but delete tag is restricted to admin
        petTypeTag = await postTag(
          {file_id: file.file_id, tag: `${appId}_pet_${petType}`},
          token
        );
        console.log('EDIT PET TYPE RESPONSE', petTypeTag);
      }

      currentUserType !== userType &&
        userTypeTag &&
        currentPetType !== petType &&
        petTypeTag &&
        Alert.alert('Post', 'Succesfully updated', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Single', {file: file});
            },
          },
        ]);
    } catch (error) {
      console.log('onSubmit EDIT file error', error.errorMessage);
    }
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
              ></Controller>

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
              ></Controller>
            </View>
            <View>
              <CustomDropDownPicker></CustomDropDownPicker>
            </View>
            <CheckBoxComponent customText="Post as: "></CheckBoxComponent>
            <CustomButton
              loading={loading}
              buttonStyle={styles.button}
              title="Save"
              fontSize={18}
              titleStyle={styles.buttonTitle}
              onPress={handleSubmit(onSubmit)}
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

EditPost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditPost;
