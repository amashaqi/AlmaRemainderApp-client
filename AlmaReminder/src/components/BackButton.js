import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const BackButton = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.place}>
      <Image
        style={styles.image}
        source={require('../../assets/images/arrow_back.png')}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
  },
  place: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 10,
  },
});

export default BackButton;
