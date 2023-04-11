import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../theme/theme';
import {emailValidator} from '../validation/emailValidator';
import {TextInput as Input} from 'react-native-paper';
import {passwordValidator} from '../validation/passwordValidator';
import {authRoute, host} from '../services/services';
import Spinner from 'react-native-loading-spinner-overlay';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import MaterialIcon from '../components/MaterialIcon';
import axios from 'axios';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isSpinerOn, setIsSpinerOn] = useState(false);

  fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token != null) {
      navigation.navigate('HomeScreen', {token: token});
      setEmail({value: '', error: ''});
      setPassword({value: '', error: ''});
    }
  };
  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions();
    }
    fetchUser();
  }, []);

  const getUser = () => {
    setIsSpinerOn(true);
    const options = {
      email: email.value,
      password: password.value,
    };
    axios
      .post(host + authRoute, options)
      .then(response => {
        setIsSpinerOn(false);
        AsyncStorage.setItem('token', response.data.token);
        navigation.navigate('HomeScreen', {token: response.data.token});
        setEmail({value: '', error: ''});
        setPassword({value: '', error: ''});
      })
      .catch(error => {
        setIsSpinerOn(false);
        alert(error.response.data.message);
      });
  };

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    } else {
      getUser();
    }
  };

  return (
    <ScrollView
      style={styles.ScrollViewStyle}
      centerContent={true}
      contentContainerStyle={styles.ScrollViewStyle}
      keyboardShouldPersistTaps="handled">
      <Background>
        <Logo />
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={text => setEmail({value: text, error: ''})}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({value: text, error: ''})}
          error={password.error}
          errorText={password.error}
          secureTextEntry={isPasswordSecure}
          right={
            <Input.Icon
              name={() =>
                isPasswordSecure ? (
                  <MaterialIcon
                    source={require('../../assets/images/eye.png')}
                    width={28}
                    height={28}
                    color="#808080"
                  />
                ) : (
                  <MaterialIcon
                    source={require('../../assets/images/eye-off.png')}
                    width={28}
                    height={28}
                    color="#808080"
                  />
                )
              }
              onPress={() => {
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true);
              }}
            />
          }
        />

        <Button mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
        <View style={styles.row}>
          <Text>Don't have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SingUp')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Spinner
          visible={isSpinerOn}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  spinnerTextStyle: {
    color: '#FFF',
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
