import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';
import {getFonts} from '../utils/Utils';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';

const CheckboxComponent = ({customText, file = null}) => {
  const {userType, setUserType} = useContext(MainContext);
  const {previousUserType} = useContext(MainContext);
  const [isOwner, setOwner] = useState(false);
  const [isSitter, setSitter] = useState(false);
  useEffect(() => {
    console.log('POST AS USER TYPE \n', userType);
  }, [userType]);

  useEffect(() => {
    console.log('PREVIOUS USER TYPE \n', previousUserType);
    setOwner(previousUserType == 'owner');
    setSitter(previousUserType == 'sitter');
  }, [previousUserType]);

  useEffect(() => {
    console.log('IS OWNER', isOwner);
    console.log('IS SITTER', isSitter);
  }, [isOwner, isSitter]);

  getFonts();
  return (
    <View style={styles.checkBoxGroup}>
      <Text style={[styles.checkBoxTitle, {alignSelf: 'center'}]}>
        {customText}
      </Text>
      <CheckBox
        center
        title="Pet owner"
        checked={isOwner}
        checkedColor="#425E20"
        onPress={() => {
          setOwner(true);
          setSitter(false);
          setUserType('owner');
        }}
        containerStyle={styles.checkBoxContainer}
        titleProps={{style: styles.checkBoxTitle}}
      />
      <CheckBox
        centerx
        title="Pet sitter"
        checked={isSitter}
        checkedColor="#425E20"
        onPress={() => {
          setSitter(true);
          setOwner(false);
          setUserType('sitter');
        }}
        containerStyle={styles.checkBoxContainer}
        titleProps={{style: styles.checkBoxTitle}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  checkBoxGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  checkBoxTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    elevation: 0,
    borderColor: 'transparent',
  },
});

CheckboxComponent.propTypes = {
  customText: PropTypes.string,
  file: PropTypes.object,
};

export default CheckboxComponent;
