import {
  fetchMessage,
  fetchMessageFulfilled,
  fetchMessageRejected,
} from '../actions/apiActions'


export const getMessage = () => async dispatch => {
  try {
    dispatch(fetchMessage());
    const response = await fetch("http://localhost:1337/message");
    const message = await response.json();
    dispatch(fetchMessageFulfilled(message))
  } catch(error) {
    console.log('Getting message Error---------', error);
    dispatch(fetchMessageRejected(error))
  }
}
