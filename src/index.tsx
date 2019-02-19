import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import {createStore } from 'redux';
import reducers from './redux/Store';
const { Provider } = require('react-redux');

const store = createStore(reducers, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
