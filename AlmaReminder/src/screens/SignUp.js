import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {theme} from '../theme/theme';
import {emailValidator} from '../validation/emailValidator';
import {TextInput as Input} from 'react-native-paper';
import {passwordValidator} from '../validation/passwordValidator';
import {userNameValidator} from '../validation/userNameValidator';
import {addUserRoute, host} from '../services/services';
import Spinner from 'react-native-loading-spinner-overlay';
import Background from '../components/Background';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import MaterialIcon from '../components/MaterialIcon';
import axios from 'axios';
import Header from '../components/Header';
import bcrypt from 'react-native-bcrypt';

const SingUp = ({navigation}) => {
  console.disableYellowBox = true;
  const [email, setEmail] = useState({value: '', error: ''});
  const [userName, setUserName] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isSpinerOn, setIsSpinerOn] = useState(false);

  const onSignUpPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const userNameError = userNameValidator(userName.value);
    if (emailError || passwordError || userNameError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setUserName({...userName, error: userNameError});
      return;
    } else if (password.value !== confirmPassword.value) {
      console.log(password);
      console.log(confirmPassword);
      alert('Password does not match');
    } else {
      addUser();
    }
  };

  const addUser = async () => {
    setIsSpinerOn(true);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password.value, salt, (err, hash) => {
        const options = {
          email: email.value,
          userName: userName.value,
          password: hash,
        };
        axios
          .post(host + addUserRoute, options)
          .then(() => {
            setIsSpinerOn(false);
            navigation.navigate('LoginScreen');
            setEmail({value: '', error: ''});
            setPassword({value: '', error: ''});
            setUserName({value: '', error: ''});
          })
          .catch(error => {
            setIsSpinerOn(false);
            alert(error.response.data.message);
          });
      });
    });
  };

  return (
    <ScrollView
      style={styles.ScrollViewStyle}
      centerContent={true}
      contentContainerStyle={styles.ScrollViewStyle}
      keyboardShouldPersistTaps="handled">
      <Background>
        <Header>Create Account</Header>
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
          label="User Name"
          returnKeyType="next"
          value={userName.value}
          onChangeText={text => setUserName({value: text, error: ''})}
          error={!!userName.error}
          errorText={userName.error}
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
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmPassword.value}
          onChangeText={text => setConfirmPassword({value: text, error: ''})}
          error={confirmPassword.error}
          errorText={confirmPassword.error}
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
        <Button mode="contained" onPress={() => onSignUpPressed()}>
          Sign Up
        </Button>
        <View style={styles.row}>
          <Text>Already have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
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

export default SingUp;
