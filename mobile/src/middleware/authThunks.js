import {
  completeSignIn,
  signOut,
  setAuthError,
  startSignIn,
  endSignIn,
  setCheckedJwt,
} from '../actions/authActions';
import { BASE_URL, HTTP_STATUS } from '../constants/apiConstants';

import { store } from '../reducers';
import { getAsyncStorageJwt, removeAsyncStorageJwt, setAsyncStorageJwt } from '../utils/asyncStorage'

export const signOutAndRemoveJwt = async () => {
  await removeAsyncStorageJwt();
  store.dispatch(signOut());
  store.dispatch(endSignIn());
}

export const attemptRefresh = async (accessToken, refreshToken) => {
  console.log('attempting refresh of access token')
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
    await signOutAndRemoveJwt();
    return false;
  } 

  const { accessToken: refreshedAccessToken } = await refreshResponse.json();
  await setAsyncStorageJwt({ accessToken: refreshedAccessToken, refreshToken })
  store.dispatch(completeSignIn({ accessToken: refreshedAccessToken, refreshToken }))

  return true;
}

export const attemptSignInWithJWT = () => async (dispatch) => {
  dispatch(startSignIn())
  dispatch(setCheckedJwt(true));

  try {
    const tokens = await getAsyncStorageJwt()
    if (!tokens) {
      return signOutAndRemoveJwt()
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
      return dispatch(completeSignIn({ accessToken, refreshToken }))
    }

    if (response.status === HTTP_STATUS.EXPIRED_TOKEN) {
      console.log('expired access token! attempting refresh');
      return attemptRefresh(accessToken, refreshToken);
    }

    console.log('Error verifying JWT---------No valid token found');
    await signOutAndRemoveJwt()

  } catch(error) {
    console.log('Error verifying JWT---------', error);
    await signOutAndRemoveJwt()
  }
}

export const signIn = (loginCreds) => async (dispatch) => {
  dispatch(startSignIn())
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
      return dispatch(endSignIn());
    } 

    const { accessToken, refreshToken } = await result.json();
    await setAsyncStorageJwt({ accessToken, refreshToken })
    return dispatch(completeSignIn({ accessToken, refreshToken }))
  } catch (e) {
    dispatch(setAuthError(e.message))
    return dispatch(endSignIn());
  }
}

export const signUp = (loginCreds) => async (dispatch) => {
    dispatch(startSignIn())
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
      return dispatch(endSignIn());
    } else {
      await setAsyncStorageJwt({ accessToken, refreshToken })
      dispatch(completeSignIn({ accessToken, refreshToken }))
    }
  } catch (e) {
    dispatch(setAuthError(e.message))    
    return dispatch(endSignIn());
  }
}