import * as actions from '../actions/actionTypes';

const initialState = {
  tickets: [],
  error: null,
  loading: false,
  selectedTicket: null,
  assigning: false,
};

const root = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_ACTION:
      return {
        ...state,
        loading: true,
        error: null
      }

    case actions.START_ASSIGNING_TICKET:
      return {
        ...state,
        assigning: true,
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

    case actions.UPDATE_TICKET_WITH_COMMENTS:
      const ticketWithStatus = { ...state.selectedTicket, comments: action.comments }
      return {
        ...state,
        selectedTicket: ticketWithStatus,
        loading: false,
      }

    case actions.BROWSE_TICKET_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        selectedTicket: action.selectedTicket
      }

    case actions.BROWSE_TICKET_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error
      }

    case actions.ASSIGN_TICKET_SUCCESS:
      const updatedSelectedTicket = {
        ...state.selectedTicket,
        assignee: action.data.assignee,
        updatedDate: action.data.updatedDate
      };

      return {
        ...state,
        assigning: false,
        error: null,
        selectedTicket: updatedSelectedTicket
      }

    case actions.ASSIGN_TICKET_FAILED:
      return {
        ...state,
        assigning: false,
        error: action.error
      }

    case actions.CLEAR_CURRENT_SELECTED_TICKET:
      return {
        ...state,
        selectedTicket: null,
        assigningData: null
      }

    case actions.CREATE_TICKET_SUCCESS:
      return {
        ...state,
        tickets: []
      }

    case actions.UPDATE_TICKET_STATUS_SUCCESS:
      const updatedTicket = {
        ...state.selectedTicket,
        status: action.data.status,
        updatedDate: action.data.updatedDate
      }
      return {
        ...state,
        loading: false,
        selectedTicket: updatedTicket
      }

    case actions.UPDATE_TICKET_STATUS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error
      }

    default:
      return state;
  }
}

export default root;