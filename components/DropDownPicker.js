import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {getFonts} from '../utils/Utils';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';

const CustomDropDownPicker = (props) => {
  const [open, setOpen] = useState(false);
  const {petType, setPetType} = useContext(MainContext);
  const [items, setItems] = useState(
    props.items || [
      {label: 'Dog', value: 'dog'},
      {label: 'Cat', value: 'cat'},
      {label: 'Bird', value: 'bird'},
      {label: 'Other', value: 'other'},
    ]
  );
  getFonts();

  return (
    <View style={props.componentContainerStyle || styles.componentContainer}>
      <Text style={props.dropdownTextStyle || styles.dropdownText}>
        Type of pet:
      </Text>
      <DropDownPicker
        open={open}
        value={petType}
        items={items}
        placeholder={props.dropdownPlaceholder}
        style={{
          width: '100%',
          backgroundColor: 'white',
          zIndex: 1,
        }}
        containerStyle={
          props.dropdownContainerStyle || styles.dropdownContainer
        }
        dropDownDirection="TOP"
        textStyle={styles.dropdownText}
        setOpen={setOpen}
        setValue={setPetType}
        setItems={setItems}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
          contentContainerStyle: {backgroundColor: 'white', zIndex: 6},
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  componentContainer: {
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  dropdownContainer: {
    alignSelf: 'center',
    width: '60%',
    backgroundColor: 'white',
  },
  dropdownText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    alignSelf: 'center',
  },
});

CustomDropDownPicker.propTypes = {
  componentContainerStyle: PropTypes.object,
  dropdownContainerStyle: PropTypes.object,
  dropdownTextStyle: PropTypes.object,
  dropdownPlaceholder: PropTypes.string,
  items: PropTypes.array,
  setValue: PropTypes.func,
};

export default CustomDropDownPicker;
