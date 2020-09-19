export const FETCH_MESSAGE = 'FETCH_MESSAGE';
export const FETCH_MESSAGE_FULFILLED = 'FETCH_MESSAGE_FULFILLED';
export const FETCH_MESSAGE_REJECTED = 'FETCH_MESSAGE_REJECTED';

export const fetchMessage = () => {
  return {
    type: FETCH_MESSAGE,
    payload: true,
  };
};

//Define a action creator to set your loading state to false, and return the data when the promise is resolved
export const fetchMessageFulfilled = (data) => {
  return {
    type: FETCH_MESSAGE_FULFILLED,
    payload: data,
    loading: false,
  };
}

export const fetchMessageRejected = (error) => {
  return {
    type: FETCH_MESSAGE_REJECTED,
    payload: error,
    loading: false,
  };
}