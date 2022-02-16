import React, {useContext} from 'react';
import {Input} from 'react-native-elements';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import MainButton from './MainButton';
import {useLogin} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const LoginForm = () => {
  const {postLogin} = useLogin();
  const {setUser, setIsLoggedIn} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const userData = await postLogin(data);
      console.log(userData);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            leftIcon={{type: 'evilicon', name: 'user', size: 40}}
            inputContainerStyle={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Username..."
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 5,
            message: 'Password has to be at least 5 characters.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            leftIcon={{type: 'evilicon', name: 'lock', size: 40}}
            inputContainerStyle={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Password..."
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />
      <MainButton onPress={handleSubmit(onSubmit)} title={'Sign in'} style={{elevation: 10}} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  formContainer: {
    width: '70%',
    alignItems: 'center',
  },
});

export default LoginForm;
