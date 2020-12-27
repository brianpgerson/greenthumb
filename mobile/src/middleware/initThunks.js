import { setApiErrors, setCompletedInit } from '../actions/appActions';
import { loadPlants } from '../actions/plantActions';
import { store } from '../reducers';
import { retrievePlants } from './plantApiThunks';

export const initializeApp = async () => {
  const { dispatch } = store;

  try {
    const { plants } = await retrievePlants();
    dispatch(loadPlants(plants));
  } catch (e) {
    console.log('Error retrieving initial plants!', e)
    dispatch(setCompletedInit(true))
    dispatch(setApiErrors(e));
    return;
  }

  dispatch(setCompletedInit(true))
}