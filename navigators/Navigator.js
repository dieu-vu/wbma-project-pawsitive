import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from 'react-native-elements';

import Login from '../views/Login';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size, type}) => {
          let iconName;
          color = 'black';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              type = 'feather';
              break;
            case 'Upload':
              iconName = 'plus-circle';
              type = 'feather';
              break;
            case 'Profile':
              iconName = 'user';
              type = 'evilicon';
              break;
          }
          return <Icon name={iconName} size={size} color={color} type={type} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen name="Upload" component={Upload}></Tab.Screen>
      <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const isLoggedIn = false;
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
