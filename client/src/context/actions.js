import constants from './constants';

export const logInUser = payload => ({ type: constants.LOGIN_USER, payload });

export const isLoggedIn = payload => ({ type: constants.IS_LOGGED_IN, payload });

export const signOutUser = () => ({ type: constants.SIGNOUT_USER });

export const setPins = payload => ({ type: constants.SET_PINS, payload });

export const createDraft = () => ({ type: constants.CREATE_DRAFT });

export const updateDraft = payload => ({ type: constants.UPDATE_DRAFT, payload });

export const setCurrentPin = payload => ({ type: constants.SET_CURRENT_PIN, payload });

export const deletePin = payload => ({ type: constants.DELETE_PIN, payload });

export const deleteDraft = () => ({ type: constants.DELETE_DRAFT });

export const addPin = payload => ({ type: constants.ADD_PIN, payload });

export const createComment = payload => ({ type: constants.CREATE_COMMENT, payload });
