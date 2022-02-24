import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from 'react-native-elements';
import Login from '../views/Login';
import Listing from '../views/Listing';
import Profile from '../views/Profile';
import Upload from '../views/Upload';
import Single from '../views/Single';
import MyPosts from '../views/MyPosts';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SavedPosts from '../views/SavedPosts';
import CustomDrawer from '../components/CustomDrawer';
import {TouchableOpacity} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
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
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{marginLeft: 16}}
          >
            <Icon name="menu" type="feather" size={22} color="black" />
          </TouchableOpacity>
        ),
      })}
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
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: '#8DD35E',
        },
        headerTintColor: 'black',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon name="menu" type="feather" size={22} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <HomeStack.Screen
        name="HomeStack"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      />
      <HomeStack.Screen
        name="Listing"
        component={Listing}
        options={{
          title: 'Listing',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      />
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

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#8DD35E',
        drawerLabelStyle: {
          color: 'black',
          fontSize: 17,
          fontFamily: 'Montserrat-SemiBold',
          marginLeft: -10,
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Icon name="home" type="feather" size={20} color={'#425E20'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favourites"
        component={SavedPosts}
        options={{
          drawerIcon: () => (
            <Icon name="bookmark" type="feather" size={20} color={'#425E20'} />
          ),
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      />
      <Drawer.Screen
        name="My posts"
        component={MyPosts}
        options={{
          drawerIcon: () => (
            <Icon name="archive" type="feather" size={20} color={'#425E20'} />
          ),
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
        }}
      />
    </Drawer.Navigator>
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
            name="Drawer"
            component={DrawerNavigator}
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
