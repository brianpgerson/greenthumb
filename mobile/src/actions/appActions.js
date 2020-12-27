export const SET_API_ERRORS = 'SET_API_ERRORS';
export const SET_COMPLETED_INIT = 'SET_COMPLETED_INIT';

export const setCompletedInit = (completedInit) => {
  return {
    type: SET_COMPLETED_INIT,
    completedInit,
  };
};

export const setApiErrors = (apiErrors) => {
  return {
    type: SET_API_ERRORS,
    apiErrors
  };
}
