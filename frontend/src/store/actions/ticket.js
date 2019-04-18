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
            assignee {
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
      .catch(err => dispatch(loadTicketsFailed(err)))
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
              updatedDate
              status
              creator {
                email
              }
              assignee {
                email
              }
              comments {
                _id
                user {
                  _id
                  name
                }
                content
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
      .catch(err => dispatch(loadTicketsFailed(err)))
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

export const assignTicket = ({ userEmail, ticketId, token }) => {
  return dispatch => {
    dispatch(startAssigninTicket());

    const reqBody = {
      query: `
        mutation AssignTicket($userEmail: String!, $ticketId: ID!) {
          assignTicket(userEmail: $userEmail, ticketId: $ticketId) {
            title
            assignee {
              email
            }
            updatedDate
          }
        }
      `,
      variables: {
        userEmail,
        ticketId
      }
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(reqBody)
    })
      .then(res => res.json())
      .then((res) => {
        if (res.errors) {
          dispatch(assignTicketFailed(res.errors[0]))
        } else {
          dispatch(assignTicketSuccess(res.data.assignTicket))
        }
      }).catch(error => assignTicketFailed(error))
  }
}

export const startAssigninTicket = () => {
  return {
    type: actions.START_ASSIGNING_TICKET
  }
}

export const assignTicketFailed = error => {
  return {
    type: actions.ASSIGN_TICKET_FAILED,
    error
  }
}

export const assignTicketSuccess = data => {
  return {
    type: actions.ASSIGN_TICKET_SUCCESS,
    data
  }
}

export const updateTicketStatus = (ticketId, status) => {
  return dispatch => {
    dispatch(startAction());

    try {
      const reqBody = {
        query: `
          mutation UpdateStatus($ticketId: ID, $status: String){
            updateStatus(ticketId: $ticketId, status: $status) {
              status
              updatedDate
            }
          }
        `,
        variables: {
          ticketId,
          status
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
            dispatch(updateTicketStatusFailed(res.errors[0]))
          } else {
            dispatch(updateTicketStatusSuccess(res.data.updateStatus))
          }
        })
        .catch(err => console.log(err))
    } catch (error) {
      dispatch(updateTicketStatusFailed(error))
    }
  }
}

export const updateTicketStatusSuccess = data => {
  return {
    type: actions.UPDATE_TICKET_STATUS_SUCCESS,
    data
  }
}

export const updateTicketStatusFailed = error => {
  return {
    type: actions.UPDATE_TICKET_STATUS_FAILED,
    error
  }
}