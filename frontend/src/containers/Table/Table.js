import React, { Component } from 'react'
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';

export class Table extends Component {
  state = {};
  render() {
    return (
      <div>
        table
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  }
}

export default connect(mapStateToProps, null)(withSnackbar(Table));