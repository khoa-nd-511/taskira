import React, { Component } from 'react';
import Navbar from '../../components/UI/Navbar/Navbar';

import { Grid } from '@material-ui/core'


class Layout extends Component {
  state = {}

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <main style={{marginTop: '2rem'}}>
          <Grid container justify="center" >
            <Grid item xs={10} md={8} lg={6}>
              {this.props.children}
            </Grid>
          </Grid>
        </main>

      </React.Fragment>
    );
  }
};

export default Layout;