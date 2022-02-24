import React, {useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import Logo from '../assets/pawsitiveLogo2.svg';

const CustomDrawer = (props) => {
  const {setIsLoggedIn} = useContext(MainContext);
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Logo style={styles.logo} />
      </View>
      <DrawerItemList {...props} />
      <View>
        <Button
          buttonStyle={{
            backgroundColor: '#425E20',
            width: Dimensions.get('window').width * 0.3,
            paddingVertical: 10,
          }}
          containerStyle={{
            borderRadius: 15,
            overflow: 'hidden',
            marginTop: 25,
            alignSelf: 'center',
          }}
          titleStyle={{
            color: 'white',
            fontSize: 18,
            paddingVertical: 7,
            fontFamily: 'Montserrat-Bold',
          }}
          style={styles.button}
          onPress={async () => {
            await AsyncStorage.clear();
            setIsLoggedIn(false);
          }}
          title="Log out"
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#425E20',
    top: Dimensions.get('window').height * -0.06,
    marginBottom: 0,
  },
  button: {
  },
  logo: {
    transform: [{scale: 0.8}],
    left: -49,
  },
});

export default CustomDrawer;
