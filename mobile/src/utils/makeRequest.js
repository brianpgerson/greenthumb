import AsyncStorage from '@react-native-community/async-storage';
import { signOutAndRemoveJwt, attemptRefresh } from '../middleware/authThunks';
import { store } from '../reducers';

import { setApiErrors } from '../actions/appActions';
import { validAccessTokenSelector, validRefreshTokenSelector } from '../selectors/authSelectors';

import { BASE_URL, HTTP_STATUS } from '../constants/apiConstants';

export const makeRequest = async (path, method, body, options = {}) => {
  const accessToken = validAccessTokenSelector(store.getState());
  if (!accessToken) {
    await signOutAndRemoveJwt()
    return;
  }

  const params = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body,
  };

  try {
    let response = await fetch(`${BASE_URL}${path}`, params);
    if (response.status === HTTP_STATUS.EXPIRED_TOKEN) {
      console.log('expired access token!');
      const refreshToken = validRefreshTokenSelector(store.getState());
      console.log(accessToken, refreshToken);
      const refreshed = await attemptRefresh(accessToken, refreshToken);
      if (!refreshed) {
        await signOutAndRemoveJwt()
        return;
      }
    
      response = await fetch(`${BASE_URL}${path}`, params);
    }

    const resJson = await response.json();
    if (response.ok) {
      return resJson;
    }

    throw new Error(resJson.errors);
    
  } catch(e) {
    console.log(e);
    throw new Error('Internal server error');
  }
}