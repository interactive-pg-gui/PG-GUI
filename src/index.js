import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'
import MainContainer from './container/MainContainer';
import { Provider } from 'react-redux';
import store from './store'

//React Hook must be enabled by swapping <App/> for MainContainer here:
//still TBD - define server route for mongoDB request when already logged in (see line 57, MainContainer.js)

ReactDOM.render(
    <Provider store={store}>
      <MainContainer/> 
    </Provider>,
  document.getElementById('root')
);