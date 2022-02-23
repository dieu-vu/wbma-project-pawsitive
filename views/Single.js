import PropTypes from 'prop-types';
import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, Dimensions, Alert} from 'react-native';
import {Card, Text, Avatar, Image} from 'react-native-elements';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';
import MainButton from '../components/MainButton';
import {useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate, getFonts, fetchAvatar} from '../utils/Utils';
import PlaceholderImage from '../components/PlaceholderImage';
import {MainContext} from '../contexts/MainContext';

const Single = ({navigation, route}) => {
  const {file} = route.params;
  // fileInfo contains extra info of the media
  const fileInfo = JSON.parse(file.description);
  console.log('SINGLE FILE \n', file);
  console.log('SINGLE FILE EXTRA \n', fileInfo);

  const {getUserById} = useUser();
  const [status, setStatus] = useState({});
  const {postFavourite} = useFavourite();
  const {update, setUpdate} = useContext(MainContext);
  const [owner, setOwner] = useState({username: ''});
  const [avatar, setAvatar] = useState('../assets/user.svg');

  // Function to save post
  const savePost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      response && Alert.alert('Saved to favourites') && setUpdate(update + 1);
    } catch (error) {
      console.error('create like error', error);
    }
  };

  // Function to handle time data in extra file info
  const getTime = (timeField) => {
    const date = new Date(timeField);
    return formatDate(date);
  };

  // Function to format added time:
  const addedTimeText = (timeData) => {
    const postTime = new Date(timeData);
    const diffMinute = (Date.now() - postTime) / (1000 * 60);
    // Convert diff time to mins, hours and days
    if (diffMinute < 60) {
      return `Posted ${Math.floor(diffMinute)} mins ago`;
    } else if (diffMinute / 60 < 24) {
      return `Posted ${Math.floor(diffMinute / 60)} hours ago`;
    } else if (diffMinute / 60 > 24) {
      return `Posted ${Math.floor(diffMinute / (60 * 24))} days ago`;
      // if comment is older than 30 days, show date only
    } else if (diffMinute / 60 > 24 * 30) {
      return `Posted on ${timeData.getDate()}-${timeData.getMonth()}-${timeData.getFullYear()}`;
    }
  };

  // Function to fetch post's owner data:
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(file.user_id, token);
      const avatarFile = await fetchAvatar(file);
      console.log('OWNER DATA', userData);
      setOwner(userData);
      setAvatar(uploadsUrl + avatarFile);
    } catch (error) {
      console.error('Fetch post owner error', error);
      setOwner({username: 'not available'});
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  getFonts();
  return (
    <ScrollView style={styles.container}>
      <View>
        {file.media_type === 'image' ? (
          <Image
            PlaceholderContent={<PlaceholderImage />}
            transition
            source={{uri: uploadsUrl + file.filename}}
            containerStyle={styles.image}
          />
        ) : (
          <Video
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            onError={(err) => {
              console.log('Video error', err);
            }}
          />
        )}
      </View>
      <LinearGradient
        colors={['#8DD35E', '#FFFFFF']}
        style={styles.linearGradient}
      >
        <Card containerStyle={[styles.infoCard]} wrapperStyle={styles.text}>
          <Card.Title h3 style={[styles.text, {textAlign: 'center'}]}>
            {file.title}
          </Card.Title>
          <Card.Title style={[styles.text, {textAlign: 'center'}]}>
            {addedTimeText(file.time_added)}
          </Card.Title>
          <Card.Title style={[styles.text, {fontSize: 16}]}>
            {fileInfo.description}
          </Card.Title>
          <View>
            <Card.Title
              style={[styles.text, {fontSize: 20, fontWeight: 'bold'}]}
            >
              Timeframe
            </Card.Title>
            <Card.Title style={styles.text}>
              From: {getTime(fileInfo.start_time)}
            </Card.Title>
            <Card.Title style={styles.text}>
              To: {getTime(fileInfo.end_time)}
            </Card.Title>
          </View>
          <View style={styles.userInfo}>
            <Avatar source={{uri: avatar}} rounded={1} />
            <Text style={[styles.text, {marginLeft: 10}]}>
              {owner.username}
            </Text>
          </View>
          <MainButton onPress={savePost} title={'Save post'} />
        </Card>
      </LinearGradient>
    </ScrollView>
  );
};

// TODO: if possible do open map

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  image: {
    width: Dimensions.get('window').width * 1.2,
    height: Dimensions.get('window').height * 0.5,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  infoCard: {
    width: '90%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 10,
    borderColor: 'transparent',
    color: 'black',
  },
  linearGradient: {
    zIndex: 1,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 0,
  },
  text: {
    textAlign: 'left',
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    zIndex: 1,
  },
  userInfo: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    borderColor: 'transparent',
    color: 'black',
    alignItems: 'flex-start',
    padding: 5,
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
