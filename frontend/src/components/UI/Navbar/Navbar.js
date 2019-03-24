import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core'

import SideDrawer from '../SideDrawer/SideDrawer';

const styles = {
  root: {
    flexGrow: 1,

  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const Navbar = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">

        <Grid container justify="center">
          <Grid item xs={10} md={8} lg={6}>
            <Toolbar style={{padding: 0}}>

              <Typography variant="h6" color="inherit" className={classes.grow}>
                Taskira
              </Typography>

              <SideDrawer />

            </Toolbar>
          </Grid>
        </Grid>
      </AppBar>
    </div>
  );
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);