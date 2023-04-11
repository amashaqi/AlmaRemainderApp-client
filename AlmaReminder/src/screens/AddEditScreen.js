import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {theme} from '../theme/theme';
import {addMedicineRoute, editMeedicineRoute, host} from '../services/services';
import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import DatePicker from 'react-native-modern-datepicker';
import Modal from 'react-native-modal';
import Button from '../components/Button';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const AddEditScreen = ({navigation, route}) => {
  const [isDatePickerVisable, setIsDatePickerVisable] = useState(false);
  const [medicineName, setMedicenName] = useState(route.params.medicenName);
  const [timesADay, setTimesADay] = useState(route.params.timesADay);
  const [medicenDescription, setMedicenDescription] = useState(
    route.params.medicenDescription,
  );
  const [numberOfPills, setNumberOfPills] = useState(
    route.params.numberOfPills,
  );
  const [initialDose, setInitialDose] = useState(route.params.initialDose);
  const [isSpinerOn, setIsSpinerOn] = useState(false);
  const [customeRemindersSet, setCustomeRemindersSet] = useState();
  const [customeRemindersArray, setCustomeRemindersArray] = useState(
    route.params.customReminders,
  );
  const [datePickerkey, setDatePickerKey] = useState(0);

  const [
    CustomeReminderDatePickerVisable,
    setIsCustomeReminderDatePickerVisable,
  ] = useState();

  const [isCustomReminderVisable, setIsCustomReminderVisable] = useState(true);

  const changeTime = time => {
    if (isDatePickerVisable) {
      setInitialDose(time), setIsDatePickerVisable(false);
    } else {
      const newTimeArray = [...customeRemindersArray];
      newTimeArray[datePickerkey] = time;
      setCustomeRemindersArray(newTimeArray);
      () => showCustomeReminderSet();
      setIsCustomeReminderDatePickerVisable(false);
    }
  };

  const setDefualtReminderBack = () => {
    setCustomeRemindersArray([]);
  };

  useEffect(() => {
    showCustomeReminderSet();
  }, [customeRemindersArray]);

  useEffect(() => {
    if (customeRemindersArray.length > 0) {
      setIsCustomReminderVisable(false);
    }
  }, []);

  const showCustomeReminderSet = () => {
    const arryOfReminders = [];

    for (let i = 0; i < timesADay; i++) {
      arryOfReminders.push(
        <TextInput
          key={i}
          label={'Pill #' + (i + 1)}
          returnKeyType="next"
          autoCapitalize="none"
          value={customeRemindersArray[i]}
          onFocus={() => {
            return (
              setIsCustomeReminderDatePickerVisable(true), setDatePickerKey(i)
            );
          }}
        />,
      );
    }
    setCustomeRemindersSet(arryOfReminders);
  };

  const editMedicine = () => {
    setIsSpinerOn(true);
    const header = {
      headers: {
        'x-auth-token': route.params.token,
      },
    };

    const options = {
      medicineName: medicineName,
      timesADay: parseInt(timesADay),
      numberOfPills: parseInt(numberOfPills),
      description: medicenDescription,
      initialDose: initialDose,
      customReminders: customeRemindersArray,
    };

    axios
      .put(host + editMeedicineRoute + route.params.id, options, header)
      .then(() => {
        setMedicenName('');
        setTimesADay('');
        setNumberOfPills('');
        setMedicenDescription('');
        setInitialDose('');
        setIsSpinerOn(false);
        navigation.goBack();
      })
      .catch(error => {
        setIsSpinerOn(false);
        alert(error.response.data.message);
      });
  };

  const addNewMedicine = () => {
    setIsSpinerOn(true);
    const header = {
      headers: {
        'x-auth-token': route.params.token,
      },
    };
    const options = {
      medicineName: medicineName,
      timesADay: parseInt(timesADay),
      numberOfPills: parseInt(numberOfPills),
      description: medicenDescription,
      initialDose: initialDose,
      customReminders: customeRemindersArray,
    };

    axios
      .post(host + addMedicineRoute, options, header)
      .then(() => {
        setMedicenName('');
        setTimesADay('');
        setNumberOfPills('');
        setMedicenDescription('');
        setInitialDose('');
        setIsSpinerOn(false);
        navigation.goBack();
      })
      .catch(error => {
        setIsSpinerOn(false);
        alert(error.response.data.message);
      });
  };

  return (
    <SafeAreaView style={styles.ScrollViewStyle}>
      <ScrollView
        style={styles.ScrollViewStyle}
        centerContent={true}
        keyboardShouldPersistTaps="handled">
        <BackButton navigation={navigation}></BackButton>
        <Background>
          <Header>{route.params.operationType} Medicine</Header>
          <TextInput
            label="Medicen Name"
            returnKeyType="next"
            value={medicineName}
            onChangeText={text => setMedicenName(text)}
            autoCapitalize="none"
          />
          <TextInput
            label="Times/Day"
            returnKeyType="next"
            value={timesADay.toString()}
            onChangeText={text => setTimesADay(text)}
            autoCapitalize="none"
          />
          <TextInput
            label="Number Of Pills"
            returnKeyType="next"
            value={numberOfPills.toString()}
            onChangeText={text => setNumberOfPills(text)}
            autoCapitalize="none"
          />
          <TextInput
            label="-------- Medicen description --------"
            style={styles.textAreaStyle}
            numberOfLines={20}
            multiline={true}
            value={medicenDescription}
            onChangeText={text => setMedicenDescription(text)}
            autoCapitalize="none"
          />
          <TextInput
            label="InitialDose"
            returnKeyType="next"
            value={initialDose}
            autoCapitalize="none"
            onFocus={() => setIsDatePickerVisable(true)}
          />
          <Modal
            isVisible={CustomeReminderDatePickerVisable || isDatePickerVisable}>
            <DatePicker
              mode="time"
              selected={
                CustomeReminderDatePickerVisable
                  ? customeRemindersArray[0]
                  : initialDose
              }
              onTimeChange={time => changeTime(time)}
            />

            <Button
              onPress={() => {
                return (
                  setIsDatePickerVisable(false),
                  setIsCustomeReminderDatePickerVisable(false)
                );
              }}
              style={styles.innerModel}
              mode="contained">
              Cancel
            </Button>
          </Modal>
          {isCustomReminderVisable ? (
            <Button
              color={theme.colors.almaPrimary}
              style={styles.customeButton}
              onPress={() => {
                if (timesADay > 0) {
                  showCustomeReminderSet();
                  setIsCustomReminderVisable(false);
                } else {
                  alert('Please enter times per day to add custom reminders');
                }
              }}
              mode="outlined">
              Custome Reminder
            </Button>
          ) : (
            <Button
              color={theme.colors.almaPrimary}
              style={styles.customeButton}
              onPress={() => {
                return (
                  setDefualtReminderBack(), setIsCustomReminderVisable(true)
                );
              }}
              mode="outlined">
              Defualt Reminder
            </Button>
          )}
          {customeRemindersArray &&
            !isCustomReminderVisable &&
            customeRemindersSet}
          <Button
            onPress={() => {
              if (route.params.operationType === 'Add') {
                return addNewMedicine();
              } else {
                return editMedicine();
              }
            }}
            style={styles.innerModel}
            mode="contained">
            {route.params.operationType === 'Add' ? 'Add' : 'Save'}
          </Button>
          <Spinner
            visible={isSpinerOn}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </Background>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScrollViewStyle: {flex: 1},
  spinnerTextStyle: {
    color: '#FFF',
  },
  flatLisStyle: {paddingBottom: 20},
  textAreaStyle: {
    height: 150,
  },
  customeButton: {
    borderColor: theme.colors.almaPrimary,
  },
});

export default AddEditScreen;
