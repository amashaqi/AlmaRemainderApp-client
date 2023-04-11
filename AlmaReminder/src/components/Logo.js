import React from 'react';
import {Image, StyleSheet} from 'react-native';

const Logo = () => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={styles.image}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 75,
    marginBottom: 8,
  },
});

export default Logo;
