export const SET_APP_LOADING = 'SET_APP_LOADING';
export const SET_APP_ERROR = 'SET_APP_ERROR';

export const setAppLoading = (isLoading) => {
  return {
    type: SET_APP_LOADING,
    loading: isLoading,
  };
};

export const setAppError = (errorMessage) => {
  return {
    type: SET_APP_ERROR,
    errorMessage
  };
}
