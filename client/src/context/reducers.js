import constants from './constants';

export const initialState = {
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
};

export default function reducer(state, { type, payload }) {
  switch (type) {
    case constants.LOGIN_USER: {
      return {
        ...state,
        currentUser: payload,
      };
    }

    case constants.IS_LOGGED_IN: {
      return {
        ...state,
        isAuth: payload,
      };
    }

    case constants.SIGNOUT_USER: {
      return {
        ...state,
        currentUser: null,
        isAuth: false,
      };
    }

    case constants.CREATE_DRAFT: {
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      };
    }

    case constants.UPDATE_DRAFT: {
      return {
        ...state,
        draft: { ...payload },
      };
    }

    case constants.DELETE_DRAFT: {
      return {
        ...state,
        draft: null,
      };
    }

    case constants.SET_PINS: {
      return {
        ...state,
        pins: [...payload],
      };
    }

    case constants.ADD_PIN: {
      return {
        ...state,
        pins: [
          ...state.pins.filter(p => p._id !== payload._id),
          payload,
        ],
      };
    }

    case constants.SET_CURRENT_PIN: {
      return {
        ...state,
        draft: null,
        currentPin: payload,
      };
    }

    case constants.DELETE_PIN: {
      return {
        ...state,
        pins: state.pins.filter(p => p._id !== payload._id),
        currentPin: (state.currentPin && state.currentPin._id === payload._id) ? null : state.currentPin,
      };
    }

    case constants.CREATE_COMMENT: {
      return {
        ...state,
        pins: state.pins.map(p => p._id === payload._id ? payload : p),
        currentPin: payload,
      };
    }

    default: { return state; }
  }
};
