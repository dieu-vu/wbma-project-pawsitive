import React, {useState, useContext, useEffect} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {ButtonGroup, Image} from 'react-native-elements';
import LottieView from 'lottie-react-native';

import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {LinearGradient} from 'expo-linear-gradient';
import MainButton from '../components/MainButton';
import Logo from '../assets/pawsitiveLogo.svg';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pickRandomImage} from '../utils/Utils';

const Login = () => {
  const {setUser, setIsLoggedIn} = useContext(MainContext);
  const [selectedRegister, setSelectedRegister] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(false);
  const {getUserByToken} = useUser();
  const animation = React.createRef();

  const signIn = () => {
    setSelectedLogin(true);
    setSelectedRegister(false);
  };

  const registerUser = () => {
    setSelectedLogin(false);
    setSelectedRegister(true);
  };

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      console.log('check token', userData);
      console.log('token in asyncStorage', userToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkToken();
    animation.current?.play();
  }, []);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      activeopacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flexGrow: 1}}
      >
        <View>
          <Image source={pickRandomImage()} style={styles.backgroundImage} />
        </View>

        <LinearGradient
          colors={['#8DD35E', '#425E20']}
          style={styles.LinearGradient}
        >
          {!selectedLogin && !selectedRegister ? (
            <View style={styles.buttonContainer}>
              <LottieView
                ref={animation}
                source={require('../assets/paws-animation.json')}
                style={{
                  width: undefined,
                  height: 150,
                  alignSelf: 'center',
                  transform: [{rotate: '30deg'}],
                }}
                loop={true}
              />
              <MainButton title="Sign in" onPress={signIn} />
              <MainButton title="Register" onPress={registerUser} />
            </View>
          ) : (
            <></>
          )}
          {selectedRegister ? <RegisterForm /> : <></>}
          {selectedLogin ? <LoginForm /> : <></>}
          <Logo style={styles.logo} />
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get('window').width * 1.4,
    height: Dimensions.get('window').height - 400,
  },
  LinearGradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 70,
    transform: [{translateY: 40}],
  },
  logo: {
    position: 'absolute',
    bottom: -90,
  },
  buttonContainer: {flex: 1, flexDirection: 'column'},
});

export default Login;
