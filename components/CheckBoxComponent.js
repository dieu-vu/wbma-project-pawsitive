import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';
import {getFonts} from '../utils/Utils';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';

const CheckboxComponent = ({customText}) => {
  const {userType, setUserType} = useContext(MainContext);
  const [oneOptionChecked, setOneOptionChecked] = useState(false);

  useEffect(() => {
    console.log('POST AS USER TYPE \n', userType);
  }, [userType]);

  getFonts();
  return (
    <View style={styles.checkBoxGroup}>
      <Text style={[styles.checkBoxTitle, {alignSelf: 'center'}]}>
        {customText}
      </Text>
      <CheckBox
        center
        title="Pet owner"
        checked={
          userType === 'sitter' && !oneOptionChecked
            ? oneOptionChecked
            : !oneOptionChecked
        }
        checkedColor="#425E20"
        onPress={() => {
          setUserType(!oneOptionChecked ? 'owner' : 'sitter');
          setOneOptionChecked(!oneOptionChecked);
        }}
        containerStyle={styles.checkBoxContainer}
        titleProps={{style: styles.checkBoxTitle}}
      />
      <CheckBox
        center
        title="Pet sitter"
        checked={
          userType === 'sitter' && !oneOptionChecked
            ? !oneOptionChecked
            : oneOptionChecked
        }
        checkedColor="#425E20"
        onPress={() => {
          setUserType(oneOptionChecked ? 'sitter' : 'owner');
          setOneOptionChecked(!oneOptionChecked);
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
};

export default CheckboxComponent;
