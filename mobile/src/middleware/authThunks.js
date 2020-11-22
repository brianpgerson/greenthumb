import {
  validateJwt,
  completeSignIn,
  validateJwtRejected,
  setAsyncStorageAuth,
  setAuthError,
} from '../actions/authActions';
import { setAppLoading } from '../actions/appActions';
import { BASE_URL, HTTP_STATUS } from '../constants/apiConstants';

import { getAsyncStorageJwt, removeAsyncStorageJwt, setAsyncStorageJwt } from '../utils/asyncStorage'

const failVerify = async (dispatch, authError) => {
  if (authError) {
    dispatch(validateJwtRejected({ authError }))
  }
  dispatch(setAppLoading(false));
  await removeAsyncStorageJwt();
}

const attemptRefresh = async (dispatch, accessToken, refreshToken) => {
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
    return failVerify(dispatch)
  } 

  console.log('successfully refreshed token')
  const { accessToken: refreshedAccessToken } = await refreshResponse.json();
  await setAsyncStorageJwt({ accessToken: refreshedAccessToken, refreshToken })
  dispatch(completeSignIn({ accessToken: refreshedAccessToken, refreshToken }))
  dispatch(setAppLoading(false));
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
      dispatch(completeSignIn({ accessToken, refreshToken }))
      return dispatch(setAppLoading(false));
    }

    if (response.status === HTTP_STATUS.EXPIRED_TOKEN) {
      console.log('expired access token!');
      return attemptRefresh(dispatch, accessToken, refreshToken);
    }

    console.log('Error verifying JWT---------No valid token found');
    await failVerify(dispatch)

  } catch(error) {
    console.log('Error verifying JWT---------', error);
    await failVerify(dispatch)
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
      dispatch(completeSignIn({ accessToken, refreshToken }))
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
      dispatch(completeSignIn({ accessToken, refreshToken }))
      return dispatch(setAppLoading(false));
    }
  } catch (e) {
    dispatch(setAuthError(e.message))    
    return dispatch(setAppLoading(false));
  }
  
}