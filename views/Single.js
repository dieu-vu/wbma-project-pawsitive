import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Button, Card, Image, Text} from 'react-native-elements';
import {Video} from 'expo-av';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {uploadsUrl} from '../utils/Variables';
import {useFavourite, useMedia, useUser} from '../hooks/ApiHooks';
import {fetchAvatar, formatDate, getFonts} from '../utils/Utils';
import PlaceholderImage from '../components/PlaceholderImage';
import {MainContext} from '../contexts/MainContext';
import CustomButton from '../components/CustomButton';
import BookMarkLogo from '../assets/bookmark8.svg';
import {AirbnbRating} from 'react-native-ratings';

const Single = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {file} = route.params;
  // fileInfo contains extra info of the media
  const fileInfo = JSON.parse(file.description);
  console.log('SINGLE FILE \n', file);
  console.log('SINGLE FILE EXTRA \n', fileInfo);

  const {getUserById} = useUser();
  const [status, setStatus] = useState({});
  const {postFavourite} = useFavourite();
  const {putMedia} = useMedia();
  const {update, setUpdate, user} = useContext(MainContext);
  const [owner, setOwner] = useState({username: ''});
  const [avatar, setAvatar] = useState('../assets/user.svg');
  const [rating, setRating] = useState(3);

  // Function to save post
  const savePost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      if (response) {
        Alert.alert('Saved to favourites');
        setUpdate(update + 1);
      }
    } catch (error) {
      console.error('create like error', error);
    }
  };

  // Function to handle time data in extra file info
  const getTime = (timeField) => {
    const date = new Date(timeField);
    return formatDate(date);
  };

  const ratingCompleted = (value) => {
    setRating(value);
  };

  const saveRating = async () => {
    try {
      const fileId = file.file_id;
      const previousRatings = fileInfo.rating;
      previousRatings.push(rating);
      file.description = JSON.stringify(fileInfo);
      const data = JSON.stringify(file);
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await putMedia(data, userToken, fileId);
      console.log('modify response', response);
      response &&
        Alert.alert('Rating', 'added', [
          {
            text: 'ok',
            onPress: () => {
              setUpdate(update + 1);
              updateRatingToUser();
            },
          },
        ]);
    } catch (error) {
      // You should notify the user about problems
      console.log('Rating not added', error);
    }
  };

  const updateRatingToUser = () => {
    // to be added later
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
      <View style={{flex: 1, paddingBottom: insets.bottom}}>
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
            <View style={styles.logoContainer}>
              <View style={{flex: 2, flexDirection: 'column', flexGrow: 2}}>
                <Card.Title h3 style={[styles.text, {textAlign: 'left'}]}>
                  {file.title}
                </Card.Title>
                <Card.Title style={[styles.text, {textAlign: 'left'}]}>
                  {addedTimeText(file.time_added)}
                </Card.Title>
              </View>
              <BookMarkLogo
                height="50%"
                width="50%"
                onPress={savePost}
                style={styles.bookMarkLogo}
              />
            </View>

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
            <View>
              <Card.Title h4>Rate your experience with the user</Card.Title>
              <AirbnbRating
                onFinishRating={ratingCompleted}
                style={styles.rating}
                count={5}
                reviews={[
                  'Terrible',
                  'Not very good',
                  'OK',
                  'Good',
                  'Excellent!',
                ]}
                defaultRating={3}
                size={20}
              />
              <CustomButton
                title="Send ratings"
                onPress={() => {
                  saveRating();
                }}
                fontSize={16}
              />
            </View>
            <View style={styles.buttonContainer}>
              {user.user_id === owner.user_id ? (
                <CustomButton
                  title="Edit post"
                  fontSize={16}
                  onPress={() => {
                    navigation.navigate('Edit post', {file: file});
                  }}
                ></CustomButton>
              ) : (
                <></>
              )}
            </View>
          </Card>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

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
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 25,
  },
  buttonStyle: {
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.3,
    height: 50,
    backgroundColor: '#A9FC73',
    borderRadius: 35,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    zIndex: 5,
    elevation: 5,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bookMarkLogo: {
    zIndex: 10,
    flex: 1,
  },
  rating: {
    marginBottom: 200,
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
