import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [userType, setUserType] = useState();
  const [petType, setPetType] = useState(null);
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mapOverlayVisible, setMapOverlayVisible] = useState(false);
  const [currentUserLocation, setCurrentUserLocation] = useState({
    latitude: 60.168415993,
    longitude: 24.9333962664,
  });
  const [postLocation, setPostLocation] = useState();
  const [previousUserType, setPreviousUserType] = useState();
  const [markers, setMarkers] = useState([]);
  const [postsInRange, setPostsInRange] = useState([]);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        userType,
        setUserType,
        petType,
        setPetType,
        selectedPetType,
        setSelectedPetType,
        isSearching,
        setIsSearching,
        searchValue,
        setSearchValue,
        mapOverlayVisible,
        setMapOverlayVisible,
        currentUserLocation,
        setCurrentUserLocation,
        postLocation,
        setPostLocation,
        previousUserType,
        setPreviousUserType,
        markers,
        setMarkers,
        postsInRange,
        setPostsInRange,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
