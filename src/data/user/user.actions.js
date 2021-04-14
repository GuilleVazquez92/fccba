import { 
  getUserData, 
  setIsLoggedInData, 
  setUserData, 
  setDarkModeData, 
  setLocalityData
} from '../dataApi';

export const loadUserData = () => async (dispatch) => {
  dispatch(setLoading(true));
  const data = await getUserData();
  dispatch(setData(data));
  dispatch(setLoading(false));
}

export const setLoading = (isLoading) => ({
  type: 'set-user-loading',
  isLoading
});

export const setData = (data) => ({
  type: 'set-user-data',
  data
});

export const logoutUser = () => async (dispatch) => {
  await setIsLoggedInData(false);
  dispatch(setUser());
};

export const setIsLoggedIn = (loggedIn) => async (dispatch) => {
  await setIsLoggedInData(loggedIn);
  return ({
    type: 'set-is-loggedin',
    loggedIn
  })
};

export const setUser = (user) => async (dispatch) => {
  await setUserData(user);
  return ({
    type: 'set-user',
    user
  });
};

export const setDarkMode = (darkMode => async (dispatch) => {
  await setDarkModeData(darkMode);
  return ({
    type: 'set-dark-mode',
    darkMode
  })
});

export const setLocality = (locality => async (dispatch) => {
  await setLocalityData(locality);
  return ({
    type: 'set-locality',
    locality
  })
});

export const setCard = (card) => async (dispatch) => {
  return ({
    type: 'set-card',
    card
  });
};