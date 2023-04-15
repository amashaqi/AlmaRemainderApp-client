import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {theme} from '../theme/theme';
import {useIsFocused} from '@react-navigation/native';
import {getAllmedicinesRoute, host} from '../services/services';
import Spinner from 'react-native-loading-spinner-overlay';
import Card from '../components/Card';
import Header from '../components/Header';
import axios from 'axios';
import PushNotifications from 'react-native-push-notification';
import BackgroundService from 'react-native-background-actions';
import MaterialIcon from '../components/MaterialIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation, route}) => {
  const [medicines, setMedicines] = useState([]);
  const [isSpinerOn, setIsSpinerOn] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const isFocused = useIsFocused();

  const veryIntensiveTask = async () => {
    const timer = setInterval(function () {
      calculateTimeLeftFromAsyncStorage();
    }, 1000 * 60 * 60);
    if (stopTimer) {
      clearInterval(timer);
    }
  };

  const calculateTimeLeftFromAsyncStorage = async () => {
    const values = await AsyncStorage.getItem('calculateTimeLetfValues');
    if (values) {
      for (time of JSON.parse(values)) {
        calculateTimeLeft(
          time.initialDose,
          time.timesADay,
          time.medicineName,
          time.customReminders,
        );
      }
    } else {
      BackgroundService.stop();
    }
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    taskName: 'medicineReminder',
    taskTitle: 'Medicine Reminder',
    taskDesc: 'Reminder to take your medicine',
    parameters: {
      delay: 1000,
    },
    importance: 4,
    vibrate: true,
  };

  const triggerNotification = medicineName => {
    PushNotifications.createChannel({
      channelId: '1',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    });

    Platform.OS === 'ios'
      ? PushNotifications.localNotificationSchedule({
          title: 'Time to take medicine!',
          message: 'Its time to take ' + medicineName + ' Pill!',
          channelId: '1',
          number: 1,
          date: new Date(Date.now() + 8 * 1000),
        })
      : PushNotifications.localNotification({
          title: 'Time to take medicine!',
          message: 'Its time to take ' + medicineName + ' Pill!',
          channelId: '1',
          number: 1,
          date: new Date(Date.now() + 8 * 1000),
        });
  };

  const getAllMedicines = async () => {
    const token = route.params.token;
    const options = {
      headers: {
        'x-auth-token': token,
      },
    };
    await axios
      .get(host + getAllmedicinesRoute, options)
      .then(async response => {
        const arrayOfCalculatedTimes = [];
        for (med of response.data.medicines) {
          await arrayOfCalculatedTimes.push({
            initialDose: med.initialDose,
            timesADay: med.timesADay,
            medicineName: med.medicineName,
            customReminders: med.customReminders,
          });
        }
        await AsyncStorage.setItem(
          'calculateTimeLetfValues',
          JSON.stringify(arrayOfCalculatedTimes),
        );
        const mappdMedicines = response.data.medicines.map(medicine => ({
          comp: (
            <Card
              key={medicine.id}
              id={medicine.id}
              navigation={navigation}
              medicenNameProp={medicine.medicineName}
              timesADayProp={medicine.timesADay}
              description={medicine.description}
              numberOfPills={medicine.numberOfPills}
              initialDose={medicine.initialDose}
              token={token}
              timeLeft={calculateTimeLeft(
                medicine.initialDose,
                medicine.timesADay,
                medicine.medicineName,
                medicine.customReminders,
              )}
              getAllMedicines={getAllMedicines}
              customReminders={medicine.customReminders}></Card>
          ),
          id: medicine.id,
        }));
        setMedicines(mappdMedicines);
        setIsSpinerOn(false);
        setIsRefreshing(false);
      })
      .catch(async error => {
        setIsSpinerOn(false);
        if (error.toString().includes('Network Error')) {
          alert('Network Error');
        } else {
          alert(error.response.data.message);
        }
      });
  };
  useEffect(() => {
    BackgroundService.on('expiration', () => {
      console.log('done');
    });
    BackgroundService.start(veryIntensiveTask, options);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getAllMedicines();
    }
  }, [isFocused]);

  const navigateToAddEditScreen = () => {
    navigation.navigate('AddEditScreen', {
      operationType: 'Add',
      medicenName: '',
      timesADay: '',
      medicenDescription: '',
      initialDose: '00:00',
      numberOfPills: '',
      token: route.params.token,
      getAllMedicines: getAllMedicines(),
      customReminders: [],
    });
  };

  const calculateTimeLeft = (
    initialDose,
    timesADay,
    medicineName,
    customReminders,
  ) => {
    let arrayOfTimes = [parseInt(initialDose.substring(0, 2))];
    let nextHour = '';
    let date = new Date();

    //Fill times you need to take medicine in an array.
    if (!customReminders || customReminders.length < 1) {
      for (let i = 1; i < timesADay; i++) {
        let newValue = arrayOfTimes[i - 1] + parseInt(24 / timesADay);
        if (newValue > 24) {
          break;
        } else {
          arrayOfTimes[i] = newValue;
        }
      }
    } else {
      arrayOfTimes = customReminders;
    }

    //Find next hour to take medicne by comparing
    //current time with times you need to take medicine.
    arrayOfTimes.every(time => {
      if (parseInt(time) > parseInt(date.toString().substring(16, 18))) {
        nextHour = time.toString().length > 1 ? time.toString() : '0' + time;
        return false;
      }
      return true;
    });

    if (!nextHour) {
      nextHour = initialDose;
    }

    let difference =
      +new Date(
        date.toString().substring(0, 16) +
          nextHour +
          (nextHour.length > 2 ? '' : ':' + initialDose.substring(3, 5)) +
          date.toString().substring(21),
      ) - +new Date();

    let timeLeft = {};

    if (difference >= 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    if (timeLeft.hours === 0) {
      triggerNotification(medicineName);
    }

    return timeLeft;
  };

  const logOut = () => {
    Alert.alert('Alert', 'Are you sure you want to Logout?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setIsSpinerOn(true);
          setStopTimer(true);
          await BackgroundService.stop();
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('calculateTimeLetfValues');
          await navigation.navigate('LoginScreen');
          await setIsSpinerOn(false);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.ScrollViewStyle}>
      <TouchableOpacity onPress={logOut} style={styles.place}>
        <Image
          style={styles.logOutImage}
          source={require('../../assets/images/logout.png')}
        />
      </TouchableOpacity>
      <Header style={styles.HeaderContainer}>My Medicines</Header>

      <FlatList
        data={medicines}
        renderItem={({item}) => item.comp}
        contentContainerStyle={styles.flatLisStyle}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              // calculateTimeLeft(initialDose, timesAday, medicineName),
              getAllMedicines();
            }}
          />
        }></FlatList>

      <TouchableOpacity
        style={styles.floatingButtonSttyle}
        onPress={() => navigateToAddEditScreen()}>
        <Text style={styles.floatingButtonStyle}>+</Text>
      </TouchableOpacity>
      {medicines.length < 1 && (
        <MaterialIcon
          style={styles.noResultsIcon}
          source={require('../../assets/images/no-results.png')}
          width={60}
          height={60}
          color={theme.colors.almaPrimary}
        />
      )}
      <Spinner
        visible={isSpinerOn}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScrollViewStyle: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  HeaderContainer: {
    alignSelf: 'center',

    justifyContent: 'space-between',
    fontSize: 21,
    color: theme.colors.almaPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 30,
  },
  noResultsIcon: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2,
    right: Dimensions.get('window').width / 2.2,
  },
  floatingButtonSttyle: {
    borderWidth: 1,
    borderColor: theme.colors.almaPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    top: Dimensions.get('window').height - 90,
    right: Dimensions.get('window').width + 15 - Dimensions.get('window').width,
    height: 60,
    backgroundColor: theme.colors.almaPrimary,
    borderRadius: 100,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  logOutImage: {
    width: 27,
    height: 27,
    tintColor: theme.colors.almaPrimary,
  },
  header: {
    fontSize: 21,
    color: theme.colors.almaPrimary,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 30,
  },
  place: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 10,
  },
  floatingButtonStyle: {color: 'white', fontSize: 28},
  flatLisStyle: {paddingBottom: 20},
});

export default HomeScreen;
