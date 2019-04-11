import * as actions from './actionTypes';


export const startAction = () => {
  return {
    type: actions.START_ACTION
  }
}


export const loadTickets = () => {
  return dispatch => {
    dispatch(startAction())

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

export const browseTicket = (ticketId) => {

  return dispatch => {
    dispatch(startAction());

    const reqBody = {
      query: `
          query BrowseTicket($ticketId: ID!) {
            getTicket(ticketId: $ticketId) {
              _id
              title
              description
              hiPri
              label
              createdDate
              creator {
                email
                createdTickets {
                  title
                }
              }
            },
          }`,
      variables: {
        ticketId
      }
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })
      .then(data => data.json())
      .then(res => {
        if (res.errors) {
          dispatch(browseTicketFailed(res.errors[0]))
        } else {
          localStorage.setItem('selectedTicket', JSON.stringify(res.data.getTicket._id))
          dispatch(browseTicketSuccess(res.data.getTicket))
        }
      })
  }
}

export const browseTicketSuccess = ticket => {
  return {
    type: actions.BROWSE_TICKET_SUCCESS,
    selectedTicket: ticket
  }
}

export const browseTicketFailed = error => {
  return {
    type: actions.BROWSE_TICKET_FAILED,
    error
  }
}

export const clearCurrentSelectedTicket = () => {
  localStorage.removeItem('selectedTicket')
  return {
    type: actions.CLEAR_CURRENT_SELECTED_TICKET
  }
}

export const createTicket = ticketInputObj => {
  return dispatch => {
    dispatch(startAction());

    const token = localStorage.getItem('token');
    const reqBody = {
      query: `
        mutation CreateTicket($ticketInput: TicketInput!) {
          createTicket(ticketInput: $ticketInput) {
            _id
            title
            label
          }
        }
      `,
      variables: {
        ticketInput: ticketInputObj
      }
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(data => data.json())
      .then(res => {
        console.log(res)
        if (res.errors) {
          dispatch(createTicketFailed(res.errors[0]));
        } else {
          dispatch(createTicketSuccess(res.data.createTicket));
          dispatch(browseTicket(res.data.createTicket._id));
        }
      })
      .catch(err => dispatch(createTicketFailed(err)))
  }
}

export const createTicketFailed = error => {
  return {
    type: actions.CREATE_TICKET_FAILED,
    error
  }
}

export const createTicketSuccess = ticket => {
  return {
    type: actions.CREATE_TICKET_SUCCESS,
    ticket
  }
}
