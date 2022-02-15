import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Dimensions,
  Platform,
  Keyboard,
  ImageBackground,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Image} from 'react-native-elements';
import {LinearGradient} from 'expo-linear-gradient';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/Variables';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import UpdateUserForm from '../components/UpdateUserForm';
import ImageLogo from '../assets/pictures.svg';
import * as ImagePicker from 'expo-image-picker';
import MainButton from '../components/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Profile = ({navigation}) => {
  const [avatar, setAvatar] = useState(
    'https://place-hold.it/200x200/8DD35E.jpeg&text=Image&bold&fontsize=14'
  );
  const [avatarUpdated, setAvatarUpdated] = useState(false);
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user} = useContext(MainContext);

  const logUserOut = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
      setAvatarUpdated(true);
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  getFonts();

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
          <ImageBackground source={{uri: avatar}} style={styles.image}>
            <View style={styles.logoContainer}>
              <ImageLogo style={styles.imageLogo} onPress={uploadImage} />
            </View>
            {/* <View style={styles.logOutButton}>
              <MainButton title="Logout" onPress={logUserOut} />
            </View>*/}
          </ImageBackground>
        </View>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#8DD35E', '#425E20']}
        >
          <Text h2 style={styles.headLine}>
            {user.full_name}
          </Text>
          <UpdateUserForm
            avatarUpdated={avatarUpdated}
            avatar={avatar}
            navigation={navigation}
          />
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  linearGradient: {
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
  headLine: {
    fontFamily: 'Montserrat-Regular',
    paddingBottom: 5,
    marginTop: 60,
    borderBottomWidth: 1,
    fontSize: 35,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height - 400,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
  },
  imageLogo: {
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
  },
  logoContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  logOutButton: {
    position: 'absolute',
    left: -20,
    top: 0,
    transform: [{scaleX: 0.7}, {scaleY: 0.8}],
  },
});

const getFonts = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
};

export default Profile;
