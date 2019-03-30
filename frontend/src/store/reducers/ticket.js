import * as actions from '../actions/actionTypes';

const initialState = {
  tickets: [],
  error: null,
  loading: false
};

const root = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_LOADING_TICKETS:
      return {
        ...state,
        loading: true,
        error: null
      }
  
    case actions.LOAD_TICKETS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error
      }
  
    case actions.LOAD_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        tickets: action.tickets
      }
  
    default:
      return state;
  }
}

export default root;