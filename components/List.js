import React, {useEffect} from 'react';
import {FlatList, View, StyleSheet, Dimensions} from 'react-native';
import propTypes from 'prop-types';
import {useMedia} from '../hooks/ApiHooks';
import SingleListItem from './SingleListItem';
import LottieView from 'lottie-react-native';
import {Text} from 'react-native-elements';
import MainButton from './MainButton';
import {getFonts} from '../utils/Utils';

const List = ({navigation, myFilesOnly}) => {
  const animation = React.createRef();

  useEffect(() => {
    animation.current?.play();
  }, [animation]);
  getFonts();

  const {mediaArray} = useMedia(myFilesOnly);

  const postList = () => {
    if (myFilesOnly) {
      if (mediaArray.length === 0) {
        return (
          <View style={{flexDirection: 'column'}}>
            <LottieView
              ref={animation}
              source={require('../assets/cat-popping-animation.json')}
              style={{
                marginTop: 40,
                width: '80%',
                aspectRatio: 1,
                alignSelf: 'center',
                backgroundColor: 'transparent',
              }}
              autoPlay={true}
              loop={true}
            />
            <Text
              style={{
                marginTop: 60,
                height: 30,
                fontFamily: 'Montserrat-Regular',
                fontSize: 18,
                alignSelf: 'center',
              }}
            >
              No posts yet
            </Text>
            <MainButton
              buttonStyle={styles.buttonStyle}
              title="Upload a new post now"
              titleStyle={styles.titleStyle}
              onPress={() => {
                navigation.navigate('Upload');
              }}
            />
          </View>
        );
      } else {
        return (
          <FlatList
            data={mediaArray}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({item}) => (
              <SingleListItem
                singleMedia={item}
                navigation={navigation}
                myFilesOnly={myFilesOnly}
              />
            )}
            ListFooterComponent={() => {
              return null;
            }}
          />
        );
      }
    } else {
      return (
        <FlatList
          data={mediaArray}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({item}) => (
            <SingleListItem
              singleMedia={item}
              navigation={navigation}
              myFilesOnly={myFilesOnly}
            />
          )}
          ListFooterComponent={() => {
            return null;
          }}
        />
      )
    }
  };
  return postList();
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 18,
  },
  buttonStyle: {
    width: Dimensions.get('window').width * 0.6,
    alignSelf: 'center',
    marginTop: 20,
    height: 40,
    backgroundColor: '#A9FC73',
    borderRadius: 35,
    marginBottom: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

List.propTypes = {
  navigation: propTypes.object,
  myFilesOnly: propTypes.bool,
};

export default List;
