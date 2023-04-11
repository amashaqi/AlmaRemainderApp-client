import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {theme} from './theme/theme';
import Timer from './logic/Timer';
import AnimatedSplash from 'react-native-animated-splash-screen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddEditScreen from './screens/AddEditScreen';
import SingUp from './screens/SignUp';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setInterval(updateLoading, 1500);
    function updateLoading() {
      setIsLoaded(true);
    }
    return () => {
      clearTimeout(isLoaded);
    };
  }, [isLoaded]);

  const Stack = createNativeStackNavigator();

  return (
    <AnimatedSplash
      translucent={false}
      isLoaded={isLoaded !== undefined ? isLoaded : false}
      logoImage={require('../assets/images/logo.png')}
      backgroundColor={'#262626'}
      logoHeight={68}
      logoWidth={272}>
      <NavigationContainer theme={{colors: theme.colors.almaPrimary}}>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SingUp" component={SingUp} />
          <Stack.Screen name="AddEditScreen" component={AddEditScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Timer" component={Timer} />
        </Stack.Navigator>
      </NavigationContainer>
    </AnimatedSplash>
  );
};

export default App;
