import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [userType, setUserType] = useState('owner');
  const [petType, setPetType] = useState(null);
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mapOverlayVisible, setMapOverlayVisible] = useState(false);

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
