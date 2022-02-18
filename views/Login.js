import React, {useState, useContext, useEffect} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {Image, Icon} from 'react-native-elements';
import LottieView from 'lottie-react-native';

import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {LinearGradient} from 'expo-linear-gradient';
import MainButton from '../components/MainButton';
import Logo from '../assets/pawsitiveLogo.svg';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
  }, [animation]);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flexGrow: 1}}
      >
        <View>
          <Image source={pickRandomImage()} style={styles.backgroundImage} />
        </View>
        {selectedLogin || selectedRegister ? (
          <View style={styles.backCrossContainer}>
            <Icon
              name="cross"
              type="entypo"
              size={30}
              color="black"
              onPress={() => {
                setSelectedLogin(false);
                setSelectedRegister(false);
              }}
            />
          </View>
        ) : (
          <></>
        )}

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
              <MainButton
                title="Sign in"
                onPress={signIn}
                buttonStyle={styles.buttonStyle}
              />
              <MainButton title="Register" onPress={registerUser} />
            </View>
          ) : (
            <></>
          )}
          {selectedRegister ? <RegisterForm /> : <></>}
          {selectedLogin ? <LoginForm /> : <></>}
          <Logo style={styles.logo} />
        </LinearGradient>
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backCross: {
    borderRadius: 50,
    width: 45,
    height: 45,
    backgroundColor: 'white',
  },
  backCrossContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2,
    left: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    transform: [{translateY: -70}, {translateX: -25}],
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  backgroundImage: {
    width: Dimensions.get('window').width * 1.4,
    height: Dimensions.get('window').height - 400,
  },
  LinearGradient: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 70,
    transform: [{translateY: -90}],
  },
  logo: {
    position: 'absolute',
    bottom: -90,
  },
  buttonContainer: {flex: 1, flexDirection: 'column'},
  buttonStyle: {
    width: Dimensions.get('window').width * 0.6,
    height: 60,
    backgroundColor: '#A9FC73',
    borderRadius: 35,
    marginBottom: '10%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

export default Login;
