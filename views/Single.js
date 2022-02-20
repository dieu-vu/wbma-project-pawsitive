import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {Card, ListItem, Text, Avatar, Image} from 'react-native-elements';
import {Video} from 'expo-av';
import {uploadsUrl} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';
import MainButton from '../components/MainButton';
import {useFavourite, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate, getFonts} from '../utils/Utils';
import PlaceholderImage from '../components/PlaceholderImage';

const Single = ({navigation, route}) => {
  const {file} = route.params;
  const fileInfo = JSON.parse(file.description);
  const [status, setStatus] = useState({});
  const {postFavourite} = useFavourite();

  const savePost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      console.log('create favourite response', response);
    } catch (error) {
      console.error('create like error', error);
    }
  };

  console.log(fileInfo);
  const getTime = (timeField) => {
    const date = new Date(timeField);
    return formatDate(date);
  };

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
          <Card.Title style={styles.text}>{file.time_added} </Card.Title>
          <Card.Title style={styles.text}>{fileInfo.description}</Card.Title>
          <Card.Title style={styles.text}>
            From: {getTime(fileInfo.start_time)}
          </Card.Title>
          <Card.Title style={styles.text}>
            To: {getTime(fileInfo.end_time)}
          </Card.Title>
          <View containerStyle={styles.userInfo}>
            <Avatar source={{uri: 'http://placekitten.com/180'}} rounded={1} />
            <Text style={styles.text}>Ownername</Text>
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
    width: Dimensions.get('window').width * 1.4,
    height: Dimensions.get('window').height * 0.5,
    aspectRatio: 1,
    resizeMode: 'contain',
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
    // transform: [{translateY: Dimensions.get('window').height * 0.5}],
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
    justifyContent: 'space-between',
    marginTop: 10,
    borderColor: 'transparent',
    color: 'black',
    alignItems: 'flex-start',
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
