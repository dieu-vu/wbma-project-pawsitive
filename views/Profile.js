import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Keyboard,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import {LinearGradient} from 'expo-linear-gradient';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/Variables';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import UpdateUserForm from '../components/UpdateUserForm';
import ImageLogo from '../assets/pictures.svg';
import * as ImagePicker from 'expo-image-picker';
import {MainContext} from '../contexts/MainContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaceholderImage from '../components/PlaceholderImage';

const Profile = ({navigation}) => {
  const [avatar, setAvatar] = useState();

  const [type, setType] = useState('image');
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);
  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
      setType(result.type);
      const formData = new FormData();
      const userToken = await AsyncStorage.getItem('userToken');
      formData.append('title', 'avatar');
      formData.append('description', '');

      const filename = result.uri.split('/').pop();
      let fileExtension = filename.split('.').pop();
      fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
      formData.append('file', {
        uri: result.uri,
        name: filename,
        type: result.type + '/' + fileExtension,
      });
      try {
        const response = await postMedia(formData, userToken);
        console.log('Upload response', response);
        if (response) {
          const tagResponse = await postTag(
            {
              file_id: response.file_id,
              tag: 'avatar_' + user.user_id,
            },
            userToken
          );
          console.log('tag response', tagResponse);
          tagResponse && Alert.alert('Profile image', 'updated');
        }
      } catch (error) {
        console.log('image upload error', error);
      }
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
    <SafeAreaView>
      <ScrollView>
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
              {!avatar ? (
                <PlaceholderImage />
              ) : (
                <ImageBackground source={{uri: avatar}} style={styles.image}>
                  <View style={styles.logoContainer}>
                    <ImageLogo style={styles.imageLogo} onPress={uploadImage} />
                  </View>
                </ImageBackground>
              )}
            </View>
            <LinearGradient
              style={styles.linearGradient}
              colors={['#fdfdfd', '#ffffff']}
            >
              <Text h2 style={styles.headLine}>
                {user.full_name}
              </Text>
              <UpdateUserForm navigation={navigation} />
            </LinearGradient>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  linearGradient: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    flexGrow: 1,
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
