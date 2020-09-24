import {
  validateJwt,
  validateJwtFulfilled,
  validateJwtRejected,
  setAsyncStorageAuth
} from '../actions/authActions';
import { setAppLoading } from '../actions/appActions';
import { BASE_URL } from '../constants/apiConstants';

import { getAsyncStorageJwt, removeAsyncStorageJwt, setAsyncStorageJwt } from '../utils/asyncStorage'


export const validateJwtAsync = () => async (dispatch) => {
  try {
    const { accessToken } = await getAsyncStorageJwt()
    if (!accessToken) {
      dispatch(setAppLoading(false));
      return;
    }
    const response = await fetch("http://localhost:1337/api/verify", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const { valid } = await response.json();
    if (valid) {
      dispatch(validateJwtFulfilled({ accessToken }))
    } else {
      dispatch(validateJwtRejected({ authError: "Invalid JWT (use refresh token?)" }))
      dispatch(setAppLoading(false));
      await removeAsyncStorageJwt();
    }
  } catch(error) {
    console.log('Getting message Error---------', error);
    await removeAsyncStorageJwt()
    dispatch(validateJwtRejected(error))
    dispatch(setAppLoading(false));
  }
}

export const signIn = (loginCreds) => async (dispatch) => { 
  const result = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginCreds),
  });


  const { accessToken, refreshToken } = await result.json();
  console.log(accessToken, refreshToken)
  set = await setAsyncStorageJwt({ accessToken, refreshToken })
  got = await getAsyncStorageJwt()
}

export const signUp = (loginCreds) => async (dispatch) => {
  
  const result = await fetch(`${BASE_URL}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginCreds),
  });

  const { accessToken, refreshToken } = await result.json();
  console.log(accessToken, refreshToken)
  set = await setAsyncStorageJwt({ accessToken, refreshToken })
  got = await getAsyncStorageJwt()
  console.log(got);
}