import {
  validateJwt,
  completeSignIn,
  validateJwtRejected,
  setAsyncStorageAuth,
  setAuthError,
} from '../actions/authActions';
import { validatedAuthSelector } from '../selectors/authSelectors';
import { store } from '../reducers';

import { BASE_URL, HTTP_STATUS } from '../constants/apiConstants';


export const addPlant = (plantRequest) => async (dispatch) => {
  try {
    const accessToken = validatedAuthSelector(store.getState());
    if (!accessToken) {
      console.log('oops! no access token');
      return;
    }
    
    const response = await fetch(`${BASE_URL}/api/plants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantRequest)
    });

    if (response.ok) {
      console.log('SUCCESS! added a plant!');
      return;
    }

    // await failVerify(dispatch)
    const res = await response.json()
    console.log('ERROR! Adding plant failed: ', res)

  } catch(error) {
    console.log('Caught ERROR! Adding plant failed', error);
  }
}