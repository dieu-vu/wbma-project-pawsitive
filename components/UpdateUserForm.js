import React, {useContext} from 'react';
import {View, StyleSheet, Alert, Dimensions} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Icon, Input} from 'react-native-elements';
import MainButton from './MainButton';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFonts} from '../utils/Utils';
import {useUser} from '../hooks/ApiHooks';

const UpdateUserForm = ({navigation}) => {
  const {putUser} = useUser();

  const {user, setUser} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      email: user.email,
      username: user.username,
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  getFonts();

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUser(data);
        navigation.navigate('Home');
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
            <Icon type={'feather'} name="mail" style={styles.logo} />
            <Input
              style={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
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
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'feather'} name="user" style={styles.logo} />
            <Input
              style={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
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
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputContainer}>
            <Icon type={'feather'} name="lock" style={styles.logo} />
            <Input
              style={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password..."
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
            <Icon type={'feather'} name="lock" style={styles.logo} />
            <Input
              style={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Confirm Password..."
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
    width: Dimensions.get('window').width - 100,
    height: Dimensions.get('window').width - 600,
    paddingTop: 20,
    display: 'flex',
    alignItems: 'center',
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
  },
  button: {
    marginBottom: 20,
  },
});

export default UpdateUserForm;
