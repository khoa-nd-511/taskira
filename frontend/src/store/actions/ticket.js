import * as actions from './actionTypes';

export const loadTickets = () => {
  return dispatch => {
    dispatch(startLoadingTickets())

    const reqBody = {
      query: `
        query {
          getTickets {
            _id
            title
            description
            hiPri
            label
            createdDate
            creator {
              email
            }
          }
        }`
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })
      .then(data => data.json())
      .then(res => {
        if (res.errors) {
          dispatch(loadTicketsFailed(res.errors[0]))
        } else {
          dispatch(loadTicketsSuccess(res.data.getTickets))
        }
      })
      .catch(err => console.log(err));
  }
}

export const startLoadingTickets = () => {
  return {
    type: actions.START_LOADING_TICKETS
  }
}

export const loadTicketsFailed = error => {
  return {
    type: actions.LOAD_TICKETS_FAILED,
    error
  }
}

export const loadTicketsSuccess = tickets => {
  return {
    type: actions.LOAD_TICKETS_SUCCESS,
    tickets
  }
}

