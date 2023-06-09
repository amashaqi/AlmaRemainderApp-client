/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';

import App from './src/App';
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
