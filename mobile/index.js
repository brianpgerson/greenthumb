import * as React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'react-redux';

import App from './App';
import {name as appName} from './app.json';
import { store } from './src/reducers';
import { APNManager } from './src/contexts/apn-context';

const Entry = () => (
  <Provider store={store}>
    <APNManager>
      <App />
    </APNManager>
  </Provider>
)
AppRegistry.registerComponent(appName, () => Entry);