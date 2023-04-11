import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../theme/theme';

const Header = props => {
  return <Text style={styles.header} {...props} />;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: theme.colors.almaPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 30,
  },
});

export default Header;
