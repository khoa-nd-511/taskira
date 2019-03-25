import React, { Component } from 'react';
import Navbar from '../../components/UI/Navbar/Navbar';

import { Grid } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';


class Layout extends Component {
  state = {}

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <main style={{ marginTop: '2rem' }}>
          <Grid container justify="center" >
            <Grid item xs={10} md={8} lg={6}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                preventDuplicate
              >
                {this.props.children}
              </SnackbarProvider>
            </Grid>
          </Grid>
        </main>
      </React.Fragment>
    );
  }
};

export default Layout;