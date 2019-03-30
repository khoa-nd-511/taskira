import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {withSnackbar} from 'notistack';

import * as actions from '../../store/actions'

export class Logout extends Component {
  componentDidMount() {
    this.props.onLogOut();
  }

  componentWillUnmount() {
    this.props.enqueueSnackbar('Sign out successfully', {
      variant: 'success'
    })
  }

  render() {
    return <Redirect to="/" />
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogOut: () => dispatch(actions.logout())
  }
}

export default connect(null, mapDispatchToProps)(withSnackbar(Logout));
