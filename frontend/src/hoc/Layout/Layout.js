import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import Navbar from '../../components/UI/Navbar/Navbar';

import { Grid } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';


class Layout extends Component {
  componentDidMount = () => {
    this.props.onCheckAutoLogin();
  }

  render() {

    return (
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        preventDuplicate
      >
        <React.Fragment>
          <Navbar />

          <main style={{ marginTop: '2rem' }}>
            <Grid container justify="center" >
              <Grid item xs={10} md={8} lg={6}>
                {this.props.children}
              </Grid>
            </Grid>
          </main>
        </React.Fragment >
      </SnackbarProvider >
    );
  }
};

const mapStateToProps = state => {
  return {
    token: state.token,
    userId: state.userId,
    isLoggedIn: state.isLoggedIn
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckAutoLogin: () => dispatch(actions.checkAutoLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);