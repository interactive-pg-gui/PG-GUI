import React from 'react';
import MainContainer from './container/MainContainer';

const useStateWithLocalStorage = localStorageKey => {
  const [loginCheck, confirmLogin] = React.useState(localStorage.getItem(localStorageKey) || 'anonymous');

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, loginCheck);
  }, [loginCheck]);

  return [loginCheck, confirmLogin];
}

const App = () => {
  const [loginCheck, confirmLogin] = useStateWithLocalStorage('loggedIn');

return (
  <MainContainer confirmLogin={confirmLogin}/>
 );
};

export default App;