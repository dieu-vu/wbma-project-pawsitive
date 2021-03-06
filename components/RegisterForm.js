import React, {useContext} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import MainButton from './MainButton';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const RegisterForm = () => {
  const {postUser, checkUsername} = useUser();
  const {setSelectedLogin, setSelectedRegister} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      const userData = await postUser(data);
      console.log('register onSubmit', userData);
      if (userData) {
        Alert.alert('Success', 'User created successfully.', [
          {
            text: 'OK',
            onPress: () => {
              setSelectedRegister(false);
              setSelectedLogin(true);
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        width: '90%',
        height: '100%',
        paddingTop: 30,
        paddingBottom: 100,
        alignItems: 'center',
      }}
    >
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters.',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              if (available) {
                return true;
              } else {
                return 'Username is already taken!';
              }
            } catch (e) {
              throw new Error(e.message);
            }
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
            errorStyle={{paddingLeft: 15}}
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
          /*
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message: 'Min 8, Uppercase, Number',
          },
          */
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
            errorStyle={{paddingLeft: 15}}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          validate: (value) => {
            const {password} = getValues();
            if (value === password) {
              return true;
            } else {
              return 'Passwords do not match.';
            }
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
            placeholder="Confirm password..."
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
            errorStyle={{paddingLeft: 15}}
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: 'Use correct format: example@example.com',
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
            placeholder="Email..."
            errorMessage={errors.email && errors.email.message}
            errorStyle={{paddingLeft: 15}}
          />
        )}
        name="email"
      />

      <MainButton onPress={handleSubmit(onSubmit)} title={'Register'} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  inputField: {
    alignSelf: 'center',
    width: '90%',
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
});

export default RegisterForm;
