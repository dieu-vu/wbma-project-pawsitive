import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Avatar, Card, Image, Text, Icon} from 'react-native-elements';
import {Video} from 'expo-av';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

import {uploadsUrl} from '../utils/Variables';
import {colors} from '../utils/Variables';
import {useFavourite, useMedia, useRating, useUser} from '../hooks/ApiHooks';
import {
  fetchAvatar,
  formatDate,
  getFonts,
  getMediaPreviousCategoryTag,
} from '../utils/Utils';
import PlaceholderImage from '../components/PlaceholderImage';
import {MainContext} from '../contexts/MainContext';
import CustomButton from '../components/CustomButton';
import {AirbnbRating} from 'react-native-ratings';

const Single = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {file} = route.params;
  // fileInfo contains extra info of the media
  const fileInfo = JSON.parse(file.description);

  const {getUserById} = useUser();
  const {addRating, getRatingsForFile} = useRating();
  const [status, setStatus] = useState({});
  const {postFavourite} = useFavourite();
  const {deleteMedia, getPostsByUserId} = useMedia();
  const {putUser} = useUser();
  const {update, setUpdate, user, setUser} = useContext(MainContext);
  const [owner, setOwner] = useState({username: ''});
  const [avatar, setAvatar] = useState('../assets/user.svg');
  const [rating, setRating] = useState(3);
  const {previousUserType, setPreviousUserType} = useContext(MainContext);
  const [subscribed, setSubcribed] = useState(false);

  let userInfo = {};
  if (user.full_name && user.full_name.includes('subscribed_media')) {
    userInfo = JSON.parse(user.full_name);
  }

  const animation = React.createRef();
  useEffect(() => {
    animation.current?.play();
  }, [animation]);

  getFonts();
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

  // Function to delete post
  const deletePost = () => {
    Alert.alert('Delete', 'your post permanently', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(file.file_id, token);
            if (response) {
              Alert.alert('Post deleted');
              setUpdate(update + 1);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  // Function to handle time data in extra file info
  const getTime = (timeField) => {
    if (!timeField) {
      return 'unknown';
    }
    const date = new Date(timeField);
    return formatDate(date);
  };

  // Function to update the rating
  const ratingCompleted = (value) => {
    setRating(value);
  };

  // Function to save rating
  const saveRating = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const fileId = file.file_id;

    if (file.user_id === user.user_id) {
      Alert.alert('You can not rate you own post');
    } else {
      try {
        const response = await addRating(
          {file_id: fileId, rating: rating},
          userToken
        );
        response &&
          Alert.alert('Rating', 'added', [
            {
              text: 'ok',
              onPress: () => {
                setUpdate(update + 1);
                calculateRatingForUser(file.user_id);
                calculateRatingForPost(file.file_id);
              },
            },
          ]);
      } catch (error) {
        Alert.alert('You have already rated this user');
        console.error('create rating error', error);
      }
    }
  };

  // Function to calculate the rating for user, based on rating on all their posts
  const calculateRatingForUser = async (userId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const mediaFiles = await getPostsByUserId(userId);
      console.log('media files', mediaFiles);
      let sum = 0;
      let count = 0;
      const response = await Promise.all(
        mediaFiles.map(async (item) => {
          const ratings = await getRatingsForFile(item.file_id, userToken);
          ratings.forEach((item) => {
            const rating = item.rating;
            console.log(rating);
            sum += rating;
            count++;
          });
        })
      );
      if (response) {
        const average = sum / count;
        console.log('average', Math.round(average));
        return average;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('getting post for user error', error);
    }
  };

  const calculateRatingForPost = async (fileId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const ratings = await getRatingsForFile(fileId, userToken);
      let average = 0;
      if (ratings) {
        let sum = 0;
        let count = 0;
        ratings.forEach((item) => {
          const rating = item.rating;
          // console.log(rating);
          sum += rating;
          count++;
          average = sum / count;
          console.log('average rating', Math.round(average));
        });
        return average;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
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

  // function to check subscription:
  const checkSubscription = () => {
    if (
      userInfo &&
      userInfo.subscribed_media &&
      userInfo.subscribed_media.includes(file.file_id)
    )
      setSubcribed(true);
  };

  // Function to add subscriber:
  const addSubscriber = async () => {
    const updatedUserData = user;
    const subscribedFileId = file.file_id;

    if (userInfo.subscribed_media) {
      const currentSubscribingList = userInfo.subscribed_media;
      console.log('CURRENT SUBSCRIBING LIST', currentSubscribingList);
      if (subscribed) {
        return;
      } else {
        userInfo.subscribed_media.push(subscribedFileId);
        console.log('UPDATED LIST', userInfo.subscribed_media);
      }
    } else {
      userInfo['subscribed_media'] = [subscribedFileId];
      console.log('ADDED NEW SUBSCRIBING LIST', userInfo.subscribed_media);
    }

    const subscriptionData = {};
    subscriptionData['full_name'] = JSON.stringify(userInfo);
    updatedUserData.full_name = subscriptionData['full_name'];
    console.log('subscribing data json', subscriptionData);
    setUser(updatedUserData);
    setSubcribed(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putUser(subscriptionData, token);
      if (response) {
        Alert.alert('Post', 'Subscribed');
        setUpdate(update + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to unsubscribe:
  const unsubscribe = async () => {
    const updatedUserData = user;
    const subscribedFileId = file.file_id;

    if (userInfo.subscribed_media) {
      // const currentSubscribingList = userInfo.subscribed_media;
      // console.log('CURRENT SUBSCRIBING LIST', currentSubscribingList);
      if (!subscribed) {
        return;
      } else {
        const updatedSubscribeArray = userInfo.subscribed_media.filter(
          (fileId) => {
            return fileId != subscribedFileId;
          }
        );
        userInfo.subscribed_media = updatedSubscribeArray;
        // console.log('UPDATED LIST', userInfo.subscribed_media);
      }
    }
    const subscriptionData = {};
    subscriptionData['full_name'] = JSON.stringify(userInfo);
    updatedUserData.full_name = subscriptionData['full_name'];
    // console.log('subscribing data json', subscriptionData);
    setUser(updatedUserData);
    setSubcribed(false);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putUser(subscriptionData, token);
      if (response) {
        Alert.alert('Post', 'Unsubscribed');
        setUpdate(update + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch owner and user type:
  useEffect(() => {
    fetchOwner();
  }, []);

  useEffect(async () => {
    const previousUserTypeApi = await getMediaPreviousCategoryTag(file, 'user');
    setPreviousUserType(previousUserTypeApi);
    console.log('previous user type', previousUserType);
    checkSubscription();
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1, paddingBottom: insets.bottom}}>
        {/* Media image/Video */}
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
          {/* Post's title and bookmark */}
          <Card containerStyle={[styles.infoCard]} wrapperStyle={styles.text}>
            <View style={styles.logoContainer}>
              <View style={{flex: 3, flexDirection: 'column', flexGrow: 3}}>
                <Card.Title
                  h4
                  style={[
                    styles.text,
                    {textAlign: 'left', fontFamily: 'Montserrat-SemiBold'},
                  ]}
                >
                  {file.title}
                </Card.Title>
                <Card.Title style={[styles.text, {textAlign: 'left'}]}>
                  {addedTimeText(file.time_added)}
                </Card.Title>
              </View>

              {/* Add post to favourites */}
              <View style={styles.bookMarkLogo}>
                <Pressable onPress={savePost}>
                  <LottieView
                    ref={animation}
                    source={require('../assets/bookmark-animation.json')}
                    style={{
                      width: '80%',
                      aspectRatio: 1,
                      alignSelf: 'center',
                      backgroundColor: 'transparent',
                    }}
                    autoPlay={true}
                    loop={false}
                  ></LottieView>
                </Pressable>
              </View>
            </View>
            <View style={styles.postSection}>
              <View style={styles.userInfo}>
                <Avatar source={{uri: avatar}} rounded={1} />
                <Text style={[styles.text, {marginLeft: 10}]}>
                  {owner.username}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Icon name="map-pin" type="feather" color="black" />
                <Text style={[styles.text, {marginLeft: 10}]}>
                  {!fileInfo.coords
                    ? 'Address not provided'
                    : !fileInfo.coords.address
                    ? 'Address not provided'
                    : fileInfo.coords.address}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Icon
                  name="cash-multiple"
                  type="material-community"
                  color="black"
                />
                <Text style={[styles.text, {marginLeft: 10}]}>
                  {!fileInfo.price
                    ? 'Price not provided'
                    : `${fileInfo.price} €`}
                </Text>
              </View>
            </View>

            {/* Post's Text description */}
            <View style={styles.postSection}>
              <Card.Title
                style={[styles.text, {fontSize: 18, fontStyle: 'italic'}]}
              >
                {fileInfo.description
                  ? fileInfo.description
                  : 'No text descriptions'}
              </Card.Title>
            </View>

            {/* Post's timeframe */}
            <View style={styles.postSection}>
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

            {/* Post rating */}
            <View style={[styles.postSection, {marginBottom: 20}]}>
              <Card.Title
                style={[styles.text, {fontSize: 20, fontWeight: 'bold'}]}
              >
                Rate your experience with the user
              </Card.Title>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <AirbnbRating
                  onFinishRating={ratingCompleted}
                  style={[styles.rating]}
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
                  reviewColor={colors.darkestGreen}
                  selectedColor={colors.darkestGreen}
                />
                <CustomButton
                  title="Send"
                  fontSize={15}
                  onPress={() => {
                    saveRating();
                  }}
                  style={{flex: 1, alignSelf: 'center'}}
                />
              </View>
            </View>

            {/* Option buttons */}
            {/* If user is post owner, allow to edit and delete and open chat/comment */}
            <View
              style={
                user.user_id === owner.user_id
                  ? [
                      styles.postSection,
                      styles.buttonContainer,
                      {flexDirection: 'row'},
                    ]
                  : [
                      styles.postSection,
                      styles.buttonContainer,
                      {flexDirection: 'column'},
                    ]
              }
            >
              {user.user_id === owner.user_id ? (
                <>
                  <Icon
                    name="edit"
                    type="feather"
                    size={40}
                    borderRadius={50}
                    color={colors.darkestGreen}
                    containerStyle={{
                      borderColor: colors.darkestGreen,
                      borderRadius: 10,
                      borderWidth: 2,
                      alignSelf: 'center',
                    }}
                    iconStyle={{padding: 3}}
                    onPress={() => {
                      navigation.navigate('Edit post', {file: file});
                    }}
                  />
                  <Icon
                    name="message-circle"
                    type="feather"
                    size={40}
                    borderRadius={50}
                    color={colors.darkestGreen}
                    containerStyle={{
                      borderColor: colors.darkestGreen,
                      borderRadius: 10,
                      borderWidth: 2,
                      alignSelf: 'center',
                    }}
                    iconStyle={{padding: 3}}
                    onPress={() => {
                      navigation.navigate('ChatMenu');
                    }}
                  />
                  <Icon
                    name="trash-outline"
                    type="ionicon"
                    size={40}
                    borderRadius={50}
                    color="red"
                    containerStyle={{
                      borderColor: 'red',
                      borderRadius: 10,
                      borderWidth: 2,
                      alignSelf: 'center',
                    }}
                    iconStyle={{padding: 3}}
                    onPress={() => {
                      const deleteConfirm = deletePost();
                      deleteConfirm && navigation.navigate('Listing');
                    }}
                  ></Icon>
                </>
              ) : (
                // If user is not post owner, allow to contact and Subscribe
                <>
                  <CustomButton
                    title="Contact user"
                    fontSize={16}
                    onPress={() => {
                      navigation.navigate('Chat', {
                        fileId: file.file_id,
                        chatStarterId: user.user_id,
                        chatResponserId: file.user_id,
                        single: true,
                      });
                    }}
                  />
                  <CustomButton
                    title={
                      subscribed
                        ? 'Unqueue'
                        : previousUserType === 'owner'
                        ? 'I can be pet sitter!'
                        : 'I want this pet sitter!'
                    }
                    fontSize={16}
                    buttonStyle={{width: '100%'}}
                    onPress={subscribed ? unsubscribe : addSubscriber}
                  />
                </>
              )}
            </View>

            {/* Button to open subscriber list */}
            <View style={[styles.postSection, {paddingBottom: 30}]}>
              {user.user_id === owner.user_id ? (
                <CustomButton
                  title="See subscriber list"
                  fontSize={16}
                  onPress={() => {
                    navigation.navigate('Subscriber List', {file: file});
                  }}
                />
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
    alignItems: 'center',
    marginBottom: 10,
  },
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 25,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    paddingBottom: 20,
  },

  icon: {
    position: 'absolute',
    zIndex: 5,
    elevation: 5,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  bookMarkLogo: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  rating: {
    flex: 1,
    marginBottom: 200,
  },
  postSection: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
