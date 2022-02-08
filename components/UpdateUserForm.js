import React, {useEffect} from 'react';
import {View, StyleSheet, Alert, Dimensions} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Input} from 'react-native-elements';
import MainButton from './MainButton';
import {useUser} from '../hooks/ApiHooks';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';

const UpdateUserForm = () => {
  const {putUser} = useUser();

  const user = {
    user_id: 38,
    username: 'Mikko',
    email: 'mikko.suhonen@metropolia.fi',
    full_name: 'Mikko Suhonen',
  };

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

  // const {setIsLoggedIn, user} = useContext(MainContext);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const userToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozOCwidXNlcm5hbWUiOiJIb3JzdCIsImVtYWlsIjoibWlra28uc3Vob25lbkBtZXRyb3BvbGlhLmZpIiwiZnVsbF9uYW1lIjpudWxsLCJpc19hZG1pbiI6bnVsbCwidGltZV9jcmVhdGVkIjoiMjAyMi0wMS0xMlQxMjoyNjowOC4wMDBaIiwiaWF0IjoxNjQ0MjU2ODA0LCJleHAiOjE2NDQzNDMyMDR9.XmTxsEMQxj28A69ej2-ONBGUKRNKXJy5Ce7eaHRZhCQ';
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        // setUser(data);
        // navigation.navigate('Profile');
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
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder={user.email}
            errorMessage={errors.email && errors.email.message}
          />
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
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder={user.username}
            errorMessage={errors.username && errors.username.message}
          />
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
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="**********"
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />
      <MainButton title="Save" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: Dimensions.get('window').width - 100,
    paddingTop: 20,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Montserrat-Regular',
  },
});

export default UpdateUserForm;
