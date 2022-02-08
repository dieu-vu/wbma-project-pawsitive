import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Dimensions, Platform, Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Image} from 'react-native-elements';
import {LinearGradient} from 'expo-linear-gradient';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/Variables';
import {useFonts} from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import UpdateUserForm from '../components/UpdateUserForm';

const Profile = ({navigation}) => {

  const [avatar, setAvatar] = useState(
    'https://place-hold.it/200x200/8DD35E.jpeg&text=Image&bold&fontsize=14'
  );
  const {getFilesByTag} = useTag();

  // const {setIsLoggedIn, user} = useContext(MainContext);
  const user = {
    user_id: 38,
    username: 'Mikko',
    email: 'mikko.suhonen@metropolia.fi',
    full_name: 'Mikko Suhonen',
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
          <Image source={{uri: avatar}} style={styles.image} />
        </View>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#8DD35E', '#425E20']}
        >
          <Text h2 style={styles.headLine}>
            {user.full_name}
          </Text>
          <UpdateUserForm />
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
    marginTop: 60,
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    fontSize: 35,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 400,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
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
