import React, { Component } from 'react';
import { connect } from 'react-redux';

// import {
//   Grid
// } from '@material-ui/core';

import * as actions from '../../store/actions';
import Spinner from '../UI/Spinner/Spinner';

export class Browse extends Component {
  componentDidMount = () => {
    const currentTicketId = JSON.parse(localStorage.getItem('selectedTicket'))
    if (currentTicketId !== null) {
      this.props.onBrowseTicket(currentTicketId);
    }
  }

  componentWillUnmount() {
    this.props.onClearCurrentSelectedTicket();
  }

  render() {

    let ticketDetail = null;

    if (this.props.loading) {
      ticketDetail = <Spinner />
    } else if (!this.props.selectedTicket) {
      ticketDetail = <p>Browse ticket failed ...</p>
    } else {
      ticketDetail = <p>{this.props.selectedTicket.title}</p>
      localStorage.setItem('selectedTicket', JSON.stringify(this.props.selectedTicket._id))
    }

    return (
      <React.Fragment>
        {ticketDetail}
      </React.Fragment>
    )
  }
}

const maptStateToProps = state => {
  return {
    selectedTicket: state.ticket.selectedTicket,
    loading: state.ticket.loading,
    error: state.ticket.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onBrowseTicket: id => dispatch(actions.browseTicket(id)),
    onClearCurrentSelectedTicket: () => dispatch(actions.clearCurrentSelectedTicket())
  }
}

export default connect(maptStateToProps, mapDispatchToProps)(Browse);
