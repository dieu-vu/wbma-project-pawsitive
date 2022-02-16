import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Alert, Dimensions, ScrollView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Icon, Input} from 'react-native-elements';
import MainButton from './MainButton';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import MailLogo from '../assets/mail.svg';
import PasswordLogo from '../assets/password.svg';
import UserLogo from '../assets/user.svg';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateUserForm = ({avatarUpdated, avatar, navigation}) => {
  const {putUser, checkUsername} = useUser();
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {user, setUser} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      confirmPassword: '',
      password: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const onSubmit = async (data) => {
    console.log('avatar', avatar);
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      if (data.full_name === null) {
        data.full_name = '';
      }
      console.log(data);
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        setUser(data);
      }
      if (avatarUpdated) {
        const formData = new FormData();
        formData.append('title', 'avatar');
        formData.append('description', '');
        const filename = avatar.split('/').pop();
        let fileExtension = filename.split('.').pop();
        fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
        formData.append('file', {
          uri: avatar,
          name: filename,
          type: 'image' + '/' + fileExtension,
        });
        try {
          const response = await postMedia(formData, userToken);
          console.log('Upload response', response);
          if (response) {
            await postTag(
              {file_id: response.file_id, tag: 'avatar_' + user.user_id},
              userToken
            );
          }
        } catch (error) {
          console.log('image upload error', error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        rules={{
          pattern: {
            value: /\S+@\S+\.\S+$/,
            message: 'Has to be valid email.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'evilicon'} name="envelope" style={styles.logo} />
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder={user.email}
              errorMessage={errors.email && errors.email.message}
            />
          </View>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters long.',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              if (available || user.username === value) {
                return true;
              } else {
                return 'Username is already taken.';
              }
            } catch (error) {
              throw new Error(error.message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'evilicon'} name="user" style={styles.logo} />
            <Input
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder={user.username}
              errorMessage={errors.username && errors.username.message}
            />
          </View>
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 5,
            message: 'Password has to be at least 5 characters.',
          },
          /*
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message: 'Min 8, Uppercase, Number',
          },
          */
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'evilicon'} name="lock" style={styles.logo} />
            <Input
              placeholderTextColor={'black'}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
              errorMessage={errors.password && errors.password.message}
            />
          </View>
        )}
        name="password"
      />
      <Controller
        control={control}
        rules={{
          validate: (value) => {
            const {password} = getValues();
            if (value === password) {
              return true;
            } else {
              return 'Passwords do not match';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'evilicon'} name="lock" style={styles.logo} />
            <Input
              placeholderTextColor={'black'}
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Confirm Password"
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          </View>
        )}
        name="confirmPassword"
      />
      <MainButton
        title="Save"
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

UpdateUserForm.propTypes = {
  avatarUpdated: PropTypes.bool,
  avatar: PropTypes.string,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  form: {
    width: Dimensions.get('window').width - 75,
    height: Dimensions.get('window').width - 600,
    paddingTop: 25,
    alignItems: 'center',
    paddingBottom: 0,
    marginBottom: 0,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  logo: {
    paddingTop: 8,
    transform: [{scaleX: 1.5}, {scaleY: 1.5}],
  },
});

export default UpdateUserForm;
