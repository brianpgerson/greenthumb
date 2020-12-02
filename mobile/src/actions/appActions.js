export const SET_APP_LOADING = 'SET_APP_LOADING';
export const SET_API_ERRORS = 'SET_API_ERRORS';

export const setAppLoading = (isLoading) => {
  return {
    type: SET_APP_LOADING,
    loading: isLoading,
  };
};

export const setApiErrors = (apiErrors) => {
  return {
    type: SET_API_ERRORS,
    apiErrors
  };
}
