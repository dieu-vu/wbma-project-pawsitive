import React, { useContext } from "react";
import PropTypes from 'prop-types';
import {SafeAreaView, ScrollView, View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {getFonts} from '../utils/Utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListAroundYou from '../components/ListAroundYou';
import ListByPetType from '../components/ListByPetType';
import { MainContext } from "../contexts/MainContext";

const Home = ({navigation}) => {
  const {setSelectedPetType} = useContext(MainContext);
  const insets = useSafeAreaInsets();
  getFonts();

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{paddingBottom: insets.bottom}}>
          <Text style={styles.titles} h4>
            Welcome to Pawsitive!
          </Text>
          <Button
            title="Listings"
            onPress={() => {
              navigation.navigate('Listing');
              setSelectedPetType('all');
            }}
            buttonStyle={styles.listings}
          />
          <Text style={styles.titles} h4>
            Listings around you
          </Text>
          <ListAroundYou />

          <Text style={styles.titles} h4>
            Discover by type of pets
          </Text>
          <ListByPetType navigation={navigation}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listings: {
    marginTop: 20,
  },
  titles: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
});

Home.propTypes = {};

export default Home;
