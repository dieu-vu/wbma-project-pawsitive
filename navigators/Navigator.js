import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from 'react-native-elements';

import Login from '../views/Login';
import Listing from '../views/Listing';
import Profile from '../views/Profile';
import Upload from '../views/Upload';
import Single from '../views/Single';
import {MainContext} from '../contexts/MainContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {position: 'absolute', backgroundColor: '#8DD35E'},
        tabBarIcon: ({focused, color, size, type}) => {
          let iconName;
          switch (route.name) {
            case 'Listing':
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
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#425E20',
      })}
      component={StackScreen}
    >
      <Tab.Screen
        name="Listing"
        component={Listing}
        options={{
          tabBarLabel: 'Home',
          title: 'Listing',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarLabel: 'Upload',
          title: 'Create Post',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={({route}) => ({
              title: route.params.file.title,
              headerStyle: {
                backgroundColor: '#8DD35E',
              },
            })}
          ></Stack.Screen>
          <Stack.Screen
            name="Upload"
            component={Upload}
            options={{title: 'Create Post'}}
          ></Stack.Screen>
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
