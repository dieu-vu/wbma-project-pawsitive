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
import Home from '../views/Home';

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
            case 'Home':
              iconName = 'home';
              type = 'feather';
              size = 24;
              break;
            case 'Upload':
              iconName = 'plus-circle';
              type = 'feather';
              size = 24;
              break;
            case 'Profile':
              iconName = 'user';
              type = 'feather';
              size = 24;
              break;
          }
          return <Icon name={iconName} size={size} color={color} type={type} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#425E20',
        drawBehind: true,
      })}
      // component={StackScreen}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{headerShown: false}}
      />
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
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8DD35E',
        },
        headerTintColor: 'black',
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      ></HomeStack.Screen>
      <HomeStack.Screen
        name="Listing"
        component={Listing}
        options={{
          title: 'Listing',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      ></HomeStack.Screen>
      <HomeStack.Screen
        name="Single"
        component={Single}
        options={({route}) => ({
          title: route.params.file.title,
        })}
      />
    </HomeStack.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8DD35E',
        },
        headerTintColor: 'black',
      }}
    >
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
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
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
