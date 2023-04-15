import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Button, Card as PaperCard, Text} from 'react-native-paper';
import {theme} from '../theme/theme';
import {deleteMedicineRoute, host} from '../services/services';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import axios from 'axios';
import MaterialIcon from './MaterialIcon';

const Card = ({
  id,
  navigation,
  medicenNameProp,
  timesADayProp,
  description,
  numberOfPills,
  initialDose,
  token,
  timeLeft,
  getAllMedicines,
  customReminders,
}) => {
  const [isSpinerOn, setIsSpinerOn] = useState(false);

  const deleteMedicine = () => {
    setIsSpinerOn(true);
    const header = {
      headers: {
        'x-auth-token': token,
      },
    };
    axios
      .delete(host + deleteMedicineRoute + id, header)
      .then(() => {
        setIsSpinerOn(false);
        getAllMedicines();
        alert('Medicine Deleted');
      })
      .catch(error => {
        setIsSpinerOn(false);
        if (error.toString().includes('Network Error')) {
          alert('Network Error');
        } else {
          alert(error.response.data.message);
        }
      });
  };

  const fireMedicineStockAlert = () => {
    Alert.alert(
      'Alert',
      '-You have ' +
        numberOfPills +
        ' Pills Of ' +
        medicenNameProp +
        '.\n' +
        '-Your Initial Dose is at: ' +
        initialDose +
        '.',
    );
  };

  const fireClockAlert = () => {
    let times = '';

    for (reminder of customReminders) {
      times += 'You have pill at: ' + reminder + '\n';
    }
    Alert.alert(times);
  };

  const fireConfirmationAlert = () => {
    Alert.alert('Alert', 'Are you sure you want to delete this Medeinine', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteMedicine()},
    ]);
  };

  const navigateToAddEditScreen = () => {
    navigation.navigate('AddEditScreen', {
      operationType: 'Edit ' + medicenNameProp,
      medicenName: medicenNameProp,
      timesADay: timesADayProp,
      medicenDescription: description,
      initialDose: initialDose,
      numberOfPills: numberOfPills,
      id: id,
      token: token,
      customReminders: customReminders,
    });
  };

  return (
    <PaperCard style={styles.cardStyle}>
      <PaperCard.Cover
        source={require('../../assets/images/Alma-coverPhoto.jpg')}
      />
      <View style={styles.header}>
        <View>
          <PaperCard.Title
            title={medicenNameProp}
            subtitle={timesADayProp + ' Times Per Day'}
          />
        </View>
        <View style={styles.numberOfPills}>
          <TouchableOpacity
            style={styles.numberOfPills}
            onPress={() => fireMedicineStockAlert()}>
            <MaterialIcon
              source={require('../../assets/images/pill.png')}
              width={25}
              height={25}
            />
          </TouchableOpacity>
          <View style={styles.timesToTakeMed}>
            <TouchableOpacity
              style={styles.timesToTakeMed}
              onPress={() => fireClockAlert()}>
              <MaterialIcon
                source={require('../../assets/images/clock.png')}
                width={25}
                height={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <PaperCard.Title
        subtitle={
          timeLeft.hours == undefined &&
          timeLeft.minutes == undefined &&
          timeLeft.seconds == undefined
            ? 'No Pills Left Today!'
            : 'Next Dose In: ' + timeLeft.hours + 'h ' + timeLeft.minutes + 'm '
        }
        subtitleStyle={styles.reminderStyle}
      />
      <PaperCard.Content style={styles.cardContentStyle}>
        <Text variant="bodyMedium">{description}</Text>
      </PaperCard.Content>
      <PaperCard.Actions style={styles.acctions}>
        <View style={styles.CardButtons}>
          <Button
            style={styles.editButtonMargin}
            color={theme.colors.almaPrimary}
            mode="outlined"
            textStyle="bold"
            compact={true}
            onPress={() => navigateToAddEditScreen()}>
            Edit Medicen
          </Button>
          <Button
            style={styles.deleteMargin}
            color={theme.colors.almaPrimary}
            compact={true}
            mode="outlined"
            onPress={() => fireConfirmationAlert()}>
            Delete
          </Button>
        </View>
      </PaperCard.Actions>
      <Spinner
        visible={isSpinerOn}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    width: 300,
    alignSelf: 'center',
    borderRadius: 7,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginTop: 30,
    borderWidth: 1,
  },
  editButtonMargin: {marginLeft: 7},
  deleteMargin: {marginRight: 5},
  CardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 3,
    width: '100%',
  },

  header: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  numberOfPills: {
    position: 'absolute',
    right: 10,
    marginTop: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timesToTakeMed: {
    position: 'absolute',
    right: 25,
    marginTop: 6,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  innerModel: {width: 240, alignSelf: 'center'},
  medName: {width: 240, alignSelf: 'center', marginTop: 20},
  acctions: {alignSelf: 'flex-end'},
  reminderStyle: {
    marginTop: -40,
    color: theme.colors.almaPrimary,
    fontWeight: 'bold',
  },
  cardContentStyle: {marginTop: -46, flex: 1},
});

export default Card;
