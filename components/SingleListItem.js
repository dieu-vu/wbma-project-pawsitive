import React, {useContext} from 'react';
import {Alert, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {Avatar, ListItem, Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variables';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const SingleListItem = ({navigation, singleMedia, myFilesOnly, savedPosts}) => {
  /* Because there can be media from user's post in other app in the shared backend:
  we check if the file has the json field for this app.
  */
  let fileInfo = {};
  if (singleMedia.description.includes('coords')) {
    fileInfo = JSON.parse(singleMedia.description);
  }

  const {deleteMedia} = useMedia();
  const {deleteFavourite} = useFavourite();
  const {update, setUpdate} = useContext(MainContext);

  // Function to delete post: Used for lists in My Post view in the drawer menu
  const deletePost = () => {
    Alert.alert('Delete', 'your post permanently', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(singleMedia.file_id, token);
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

  // Function to remove favorite: Used for lists in Favourites view in the drawer menu
  const removeSavedPost = () => {
    Alert.alert('Favourite', 'will be removed from list', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteFavourite(singleMedia.file_id, token);
            if (response) {
              console.log('favourite removed');
              setUpdate(update + 1);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  /* Because there can be media from user's post in other app in the shared backend:
  we render the list item only when the file has the json field for this app.
  */
  if (fileInfo) {
    return (
      <ListItem
        bottomDivider
        style={styles.listItem}
        Component={TouchableOpacity}
        linearGradientProps={{
          colors: ['#8DD35E', '#425E20'],
          start: {x: 0.1, y: 0.3},
          end: {x: 0, y: 0.2},
        }}
        ViewComponent={LinearGradient}
        onPress={() => {
          navigation.navigate('Single', {file: singleMedia});
        }}
      >
        <Avatar
          size="large"
          rounded={true}
          source={{
            uri: uploadsUrl + singleMedia.thumbnails.w160,
          }}
        />
        <ListItem.Content style={styles.itemContent}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <ListItem.Title numberOfLines={2} h4 style={styles.title}>
              {singleMedia.title}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subTitle}>
              {/* Limit the length of text on list item to 70 characters */}
              {fileInfo.description && fileInfo.description.length > 70
                ? `${fileInfo.description.substring(0, 70)} ...`
                : fileInfo.description}
            </ListItem.Subtitle>
          </View>

          {/* Conditionally display buttons on My Post and Favourite views (on the drawer menu) */}
          {!myFilesOnly && !savedPosts ? (
            <View style={{marginLeft: 5, marginRight: 5}}>
              <Text style={{fontSize: 20, fontFamily: 'Montserrat-SemiBold'}}>
                {!fileInfo.price || fileInfo.price === '0'
                  ? 'FREE'
                  : `${fileInfo.price}€`}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {myFilesOnly && (
            <Button
              title="Delete"
              onPress={deletePost}
              style={styles.button}
              buttonStyle={{backgroundColor: '#A9FC73'}}
              containerStyle={{
                borderWidth: 0.5,
                borderColor: '#425E20',
                marginTop: 10,
                shadowColor: '#425E20',
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,
                elevation: 18,
                alignSelf: 'flex-end',
              }}
              titleStyle={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
              }}
            />
          )}
          {savedPosts && (
            <Button
              title="Remove"
              onPress={removeSavedPost}
              buttonStyle={{backgroundColor: '#A9FC73'}}
              style={styles.button}
              containerStyle={{
                borderWidth: 0.5,
                borderColor: '#425E20',
                marginTop: 10,
                shadowColor: '#425E20',
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,
                elevation: 18,
                alignSelf: 'flex-end',
              }}
              titleStyle={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
              }}
            />
          )}
        </ListItem.Content>
      </ListItem>
    );
  }
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#8DD35E',
    marginBottom: 5,
    marginTop: 5,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
  },
  subTitle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

SingleListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
  savedPosts: PropTypes.bool,
};

export default SingleListItem;
