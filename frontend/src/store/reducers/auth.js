
import * as actions from '../actions/actionTypes';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  isLoggedIn: false
};

export const root = (state = initialState, action) => {
  switch (action.type) {
    case actions.CHECK_AUTH_START:
      return {
        ...state,
        error: null,
        loading: false
      }

    case actions.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        loading: false,
        isLoggedIn: action.isLoggedIn
      }

    case actions.CHECK_AUTH_FAIL:
      return {
        ...state,
        error: action.errors,
        loading: false
      }

    case actions.LOG_OUT:
      return {
        ...state,
        error: null,
        token: null,
        userId: null,
        isLoggedIn: false
      }

    default:
      return state;
  }
}

export default root;