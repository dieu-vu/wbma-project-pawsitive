import React, {useState} from 'react';
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
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import {LinearGradient} from 'expo-linear-gradient';
import MainButton from '../components/MainButton';
import Logo from '../assets/pawsitiveLogo.svg';

const Login = () => {
  const [selectedRegister, setSelectedRegister] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(false);
  const loginScreenImages = [
    require('../assets/dogSmiling1.jpg'),
    require('../assets/dogSmiling2.jpg'),
    require('../assets/sheepGroup.jpg'),
  ];

  const pickRandomImage = () => {
    const selection = Math.floor(Math.random() * loginScreenImages.length);
    return loginScreenImages[selection];
  };

  const signIn = () => {
    setSelectedLogin(true);
    setSelectedRegister(false);
  };

  const registerUser = () => {
    setSelectedLogin(false);
    setSelectedRegister(true);
  };

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
            <View>
              <MainButton title="Sign in" onPress={signIn} />
              <MainButton title="Register" onPress={registerUser} />
            </View>
          ) : (
            <></>
          )}
          {selectedRegister ? <RegisterForm /> : <></>}
          {selectedLogin ? <LoginForm /> : <></>}

          {/* // TODO find a way to render correct form (login / register) based on
          // which button was pressed */}
          {/* {selectedRegister ? <RegisterForm /> : <></>}*/}
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
});

export default Login;
