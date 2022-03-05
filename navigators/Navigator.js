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
import Map from '../views/Map';
import {MainContext} from '../contexts/MainContext';
import Home from '../views/Home';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SavedPosts from '../views/SavedPosts';
import CustomDrawer from '../components/CustomDrawer';
import {TouchableOpacity} from 'react-native';
import FullScreenMap from '../components/FullScreenMap';
import EditPost from '../views/EditPost';
import Comments from '../views/Comments';
import CommentsForAdmin from '../views/CommentsForAdmin';
import SubscriberList from '../views/SubscriberList';

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
            <Icon name="menu" type="feather" size={23} color="black" />
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
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8DD35E',
          fontFamily: 'Montserrat-Bold',
        },
        headerTintColor: 'black',
      }}
    >
      <HomeStack.Screen
        name="HomeStack"
        component={Home}
        options={({navigation}) => ({
          tabBarLabel: 'Home',
          title: 'Home',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Icon
                name="menu"
                type="feather"
                size={23}
                color="black"
                style={{marginRight: 18}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="Listing"
        component={Listing}
        options={{
          title: 'Listing',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
        }}
      />
      <HomeStack.Screen
        name="Map"
        component={Map}
        options={{
          title: 'Map',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
        }}
      />
      <HomeStack.Screen
        name="Single"
        component={Single}
        options={({route}) => ({
          title: route.params.file.title,
          headerStyle: {
            fontSize: 20,
            backgroundColor: '#8DD35E',
            color: 'black',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
        })}
      />
      <HomeStack.Screen
        name="Edit post"
        component={EditPost}
        options={({route}) => ({
          title: 'Edit Post',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
          headerBackTitle: 'Post',
        })}
      />
      <HomeStack.Screen
        name="Subscriber List"
        component={SubscriberList}
        options={({route}) => ({
          title: 'Subscriber list',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
          headerBackTitle: 'Post',
        })}
      />
      <HomeStack.Screen
        name="Comments"
        component={Comments}
        options={({route}) => ({
          title: 'Comments',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
          headerBackTitle: 'Post',
        })}
      />
      <HomeStack.Screen
        name="Comments admin"
        component={CommentsForAdmin}
        options={({route}) => ({
          title: 'Comments',
          headerStyle: {
            backgroundColor: '#8DD35E',
          },
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
          },
          headerBackTitleStyle: {
            fontFamily: 'Montserrat-Regular',
          },
          headerBackTitle: 'Post',
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
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
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
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
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
          fontFamily: 'Montserrat-Bold',
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
