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

export const browseTicket = (ticketId) => {
  const currentTicket = JSON.parse(localStorage.getItem('selectedTicket'));

  return dispatch => {
    dispatch(startBrowsingTicket());

    if (currentTicket !== null) {
      localStorage.setItem('selectedTicket', JSON.stringify(currentTicket))
      dispatch(browseTicketSuccess(currentTicket));

    } else {

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
              localStorage.setItem('selectedTicket', JSON.stringify(res.data.getTicket))
            dispatch(browseTicketSuccess(res.data.getTicket))
          }
        })
    }
  }
}

export const startBrowsingTicket = () => {
  return {
    type: actions.START_BROWSING_TICKET
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