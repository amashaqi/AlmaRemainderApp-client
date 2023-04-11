import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Text,
} from 'react-native';

import {theme} from '../theme/theme';

import Background from '../components/Background';
import DatePicker from 'react-native-modern-datepicker';

const LoginScreen = ({}) => {
  const [open, setOpen] = useState(false);

  return (
    <ScrollView
      style={styles.ScrollViewStyle}
      centerContent={true}
      contentContainerStyle={styles.ScrollViewStyle}
      keyboardShouldPersistTaps="handled">
      <Background>
        <TouchableOpacity
          onPress={() => {
            setOpen(true);
          }}>
          <Text style={styles.link}>Get Credentionals</Text>
        </TouchableOpacity>
        <DatePicker mode="time" />
      </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.almaPrimary,
  },
  link: {
    fontWeight: 'bold',
    marginTop: 1,
    color: theme.colors.almaPrimary,
  },
  ScrollViewStyle: {
    flex: 1,
  },
});

export default LoginScreen;
