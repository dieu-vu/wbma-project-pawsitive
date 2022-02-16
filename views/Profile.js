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
  FlatList,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
      console.log(avatar);
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
      <KeyboardAwareScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: '#425E20'}}
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
      >
        <View>
          <ImageBackground source={{uri: avatar}} style={styles.image}>
            <View style={styles.logoContainer}>
              <ImageLogo style={styles.imageLogo} onPress={uploadImage} />
            </View>
            <View style={styles.logOutButton}>
              <MainButton title="Logout" onPress={logUserOut} />
            </View>
          </ImageBackground>
        </View>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#8DD35E', '#425E20']}
        >
          <View style={{borderBottomWidth: 1}}>
            <Text h2 style={styles.headLine}>
              {user.full_name}
            </Text>
          </View>
          <UpdateUserForm
            avatarUpdated={avatarUpdated}
            avatar={avatar}
            navigation={navigation}
          />
        </LinearGradient>
      </KeyboardAwareScrollView>
    </TouchableOpacity>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  linearGradient: {
    zIndex: 1,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    borderRadius: 48,
    transform: [{translateY: -43}],
    paddingBottom: 0,
    marginBottom: 0,
  },
  headLine: {
    fontFamily: 'Montserrat-Bold',
    paddingBottom: 0,
    marginTop: 40,
    borderBottomWidth: 5,
    fontSize: 35,
    paddingHorizontal: 10,
    fontWeight: '900',
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height - 400,
    top: 0,
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
