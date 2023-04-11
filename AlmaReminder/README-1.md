# Alma Reminder Mobile Application


## A cross-platform mobile application project built using React Native and Java Script


This Application allows users to sign up for a service that is a reminder for the patients to take their medicines. Also, it gives
them the ability to manipulate their medicines and their details by adding, editing, and deleting them. it also allows them to add reminders in different ways and customize and edit them.
The reminders come as notifications to notify the user to take their medicine when it's time to take it.
Features supported:


* Sign up for a user using email, user name, and password.
* Fields validation like email convention, empty fields, and password.
* Login to user account.
* Authentication System using JWT.
* Storing token in asynchronous local storage.
* Home screen contains patients' medicines.
* Eeah medicine is represented as a Card having medicine details.
* Medicine details are the medicine name, times per day to take medicine,   medicine description, number of pills in this medicine, times to take medicine, and the initial dose.
* User can create medicine and add it to the list of medicines user already have. 
* Users can delete Medicine.
* Users can edit on Medicine.
* When refreshing page medicines for a user will be brought.
* Set default reminder to take medicine depends on the initial dose and times per a day.
* Set custom reminders for each pill user want to take per day user

## Watch a demo for the Mobile Application
https://drive.google.com/file/d/1j9LeLvN7llAX2RXh6gDCp0VBAi8RQqzG/view?usp=share_link


## Install Insrtruction

Setup react native environment:

1. Make sure you have reactg native version 0.71.5.
2. Make sure you have nodejs version 18.15.0 or higher installed.
3. Make sure you have ruby version 2.7.6.
4. Make sure you have CocoaPods installed.
5. For IOS make sure to have Xcode installed and simulator.
6. For android make sure you have android studio and download.
Android SDK version Android 13 (Tiramisu).
Android SDK Platform.
Android Virtual Device.
7. Configure the ANDROID_HOME environment variable:
Add the following lines to your ~/.zprofile or ~/.zshrc (if you are using bash, then ~/.bash_profile or ~/.bashrc) config file:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools


Setup Alma reminder Project environment:

1. Clone this project.
2. Change the path in (./Android/local.properties) to your machine path.
3. Type npm install.
4. change dirctoery to ios and type pod install.
5. run projct using npx react-native start and then (i) for ios and (a) for android