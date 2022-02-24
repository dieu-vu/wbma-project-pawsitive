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
        contentContainerStyle={{
          flex: 1,
          minHeight: Dimensions.get('window').height,
        }}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        style={{flexGrow: 1}}
        extraScrollHeight={Platform.OS === 'ios' ? 0 : 90}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <View>
            <Image
              source={pickRandomImage()}
              style={
                selectedRegister
                  ? styles.backgroundImageRegister
                  : styles.backgroundImage
              }
            />
          </View>
          {selectedLogin || selectedRegister ? (
            <View
              style={
                selectedRegister
                  ? [
                      styles.backCrossContainer,
                      styles.backCrossContainerRegister,
                    ]
                  : [styles.backCrossContainer, styles.backCrossContainerLogin]
              }
            >
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

          <View style={styles.gradientContainer}>
            <LinearGradient
              colors={['#8DD35E', '#425E20']}
              style={
                selectedRegister
                  ? [styles.linearGradientCommon, styles.linearGradientRegister]
                  : [styles.linearGradientCommon, styles.linearGradientLogin]
              }
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
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: Dimensions.get('window').height * 0.1,
                  overflow: 'hidden',
                }}
              >
                {selectedRegister ? <RegisterForm /> : <></>}
                {selectedLogin ? <LoginForm /> : <></>}
              </View>

              <Logo
                style={
                  Platform.OS === 'ios' ? styles.logoIos : styles.logoAndroid
                }
              />
            </LinearGradient>
          </View>
        </View>
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
    top: Dimensions.get('window').height * 0.45,
    left: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    transform: [{translateY: -70}, {translateX: -25}],
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  backCrossContainerLogin: {
    top: Dimensions.get('window').height * 0.45,
  },
  backCrossContainerRegister: {
    top: Dimensions.get('window').height * 0.15,
  },
  backgroundImageRegister: {
    width: Dimensions.get('window').width * 1.4,
    height: Dimensions.get('window').height * 0.2,
  },
  backgroundImage: {
    width: Dimensions.get('window').width * 1.4,
    height: Dimensions.get('window').height * 0.5,
  },
  gradientContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    transform: [{translateY: Dimensions.get('window').height * -0.1}],
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: -100,
  },
  linearGradientCommon: {
    zIndex: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  linearGradientLogin: {
    height: Dimensions.get('window').height * 0.6,
  },
  linearGradientRegister: {
    height: Dimensions.get('window').height * 0.9,
  },
  logoIos: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * -0.125,
  },
  logoAndroid: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * -0.04,

  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',

  },
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
