export const SET_ACTIVE_SCREEN = 'SET_ACTIVE_SCREEN';

export const setActiveDrawerScreen = (activeScreen) => {
  return {
    type: SET_ACTIVE_SCREEN,
    activeScreen
  };
};