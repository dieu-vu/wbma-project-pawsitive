import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {getFonts} from '../utils/Utils';
import {MainContext} from '../contexts/MainContext';

const CustomDropDownPicker = () => {
  const [open, setOpen] = useState(false);
  const {petType, setPetType} = useContext(MainContext);
  const [items, setItems] = useState([
    {label: 'Dog', value: 'dog'},
    {label: 'Cat', value: 'cat'},
    {label: 'Bird', value: 'bird'},
    {label: 'Other', value: 'other'},
  ]);
  getFonts();

  return (
    <View style={styles.componentContainer}>
      <Text style={styles.dropdownText}>Type of pet:</Text>
      <DropDownPicker
        open={open}
        value={petType}
        items={items}
        style={{width: '100%'}}
        containerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        setOpen={setOpen}
        setValue={setPetType}
        setItems={setItems}
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
  },
  dropdownText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    alignSelf: 'center',
  },
});

export default CustomDropDownPicker;
