import React, {useContext} from 'react';
import {View, Text, Button} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const CustomDrawer = (props) => {
  const {setIsLoggedIn} = useContext(MainContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View>
        <Button
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

export default CustomDrawer;
