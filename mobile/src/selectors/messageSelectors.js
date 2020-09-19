import { createSelector } from 'reselect';

const getApi = ({ api }) => api;
const apiMessageSelector = createSelector(getApi, ({ message }) => message);

export const selectFormattedMessage = createSelector(
  apiMessageSelector,
  (message) => message ? message.toUpperCase() : 'no message yet'
);