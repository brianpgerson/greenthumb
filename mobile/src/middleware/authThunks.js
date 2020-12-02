import {
  validateJwt,
  setCredentials,
  signOut,
  setAsyncStorageAuth,
  setAuthError,
} from '../actions/authActions';
import { setAppLoading } from '../actions/appActions';
import { BASE_URL, HTTP_STATUS } from '../constants/apiConstants';

import { store } from '../reducers';
import { getAsyncStorageJwt, removeAsyncStorageJwt, setAsyncStorageJwt } from '../utils/asyncStorage'

export const signOutAndRemoveJwt = async () => {
  store.dispatch(setAppLoading(false));
  store.dispatch(signOut())
  await removeAsyncStorageJwt();
}

const failVerify = async (authError) => {
  if (authError) {
    store.dispatch(signOut({ authError }))
  }
  store.dispatch(setAppLoading(false));
  await removeAsyncStorageJwt();
}

const attemptRefreshAndSetLoadingFalse = (accessToken, refreshToken) => 
  attemptRefresh(accessToken, refreshToken, true)

export const attemptRefresh = async (accessToken, refreshToken, stopLoading) => {
  const refreshResponse = await fetch(`${BASE_URL}/api/refresh`, {
    method: 'POST',
    headers: {
      'xxx-refresh-token': `Token ${refreshToken}`,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (refreshResponse.status !== HTTP_STATUS.OK) {
    const msg = await refreshResponse.json()
    console.log('Failed to refresh token', message)
    await failVerify();
    return false;
  } 

  const { accessToken: refreshedAccessToken } = await refreshResponse.json();
  await setAsyncStorageJwt({ accessToken: refreshedAccessToken, refreshToken })
  store.dispatch(setCredentials({ accessToken: refreshedAccessToken, refreshToken }))
  if (stopLoading) {
    store.dispatch(setAppLoading(false));
  }

  return true;
}

export const validateJwtAsync = () => async (dispatch) => {
  // return failVerify(dispatch) // TODO delete me
  try {
    const tokens = await getAsyncStorageJwt()
    if (tokens == null) {
      return dispatch(setAppLoading(false));
    }

    const { accessToken, refreshToken } = tokens;

    const response = await fetch(`${BASE_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const { valid } = await response.json();
    if (valid) {
      console.log('valid access token!');
      dispatch(setCredentials({ accessToken, refreshToken }))
      return dispatch(setAppLoading(false));
    }

    if (response.status === HTTP_STATUS.EXPIRED_TOKEN) {
      console.log('expired access token!');
      return attemptRefreshAndSetLoadingFalse(accessToken, refreshToken);
    }

    console.log('Error verifying JWT---------No valid token found');
    await failVerify()

  } catch(error) {
    console.log('Error verifying JWT---------', error);
    await failVerify()
  }
}

export const signIn = (loginCreds) => async (dispatch) => {
  try {    
    const result = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginCreds),
    });

    if (result.status === HTTP_STATUS.FORBIDDEN) {  
      dispatch(setAuthError('Invalid credentials!'))
      return dispatch(setAppLoading(false));  
    } else {
      const { accessToken, refreshToken } = await result.json();
      await setAsyncStorageJwt({ accessToken, refreshToken })
      dispatch(setCredentials({ accessToken, refreshToken }))
      return dispatch(setAppLoading(false));
    }
  } catch (e) {
    dispatch(setAuthError(e.message))
    return dispatch(setAppLoading(false));
  }
}

export const signUp = (loginCreds) => async (dispatch) => {
  try {    
    const result = await fetch(`${BASE_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginCreds),
    });

    const { accessToken, refreshToken, error } = await result.json();

    if (error) {  
      dispatch(setAuthError(error))
      return dispatch(setAppLoading(false));
    } else {
      await setAsyncStorageJwt({ accessToken, refreshToken })
      dispatch(setCredentials({ accessToken, refreshToken }))
      return dispatch(setAppLoading(false));
    }
  } catch (e) {
    dispatch(setAuthError(e.message))    
    return dispatch(setAppLoading(false));
  }
}