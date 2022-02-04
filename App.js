import React from 'react';
import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';

const App = () => {
  return (
    <>
      <MainProvider>
        <Navigator />
      </MainProvider>
      <StatusBar style={'light'} />
    </>
  );
};

export default App;
