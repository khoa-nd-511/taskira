import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './SideDrawer.css';

import { withStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  IconButton
} from '@material-ui/core';

import {
  MenuSharp,
  Dashboard,
  CreateOutlined,
  TableChartOutlined,
  AccountCircleOutlined
} from '@material-ui/icons';

const styles = {
  list: {
    width: 250,
  },
  menuButton: {
    marginLeft: -12,
  },
};

class SideDrawer extends Component {

  state = {
    openSideDrawer: false
  }

  toggleSideDrawer = open => {
    this.setState({ openSideDrawer: open })
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={[classes.list, "side-list"].join(' ')} >

        <List>
          <NavLink to="/" exact>
            <ListItem button>
              <Dashboard />
              <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>
          <NavLink to="/add">
            <ListItem button>
              <CreateOutlined />
              <ListItemText primary="Create Ticket" />
            </ListItem>
          </NavLink>
          <NavLink to="/board">
            <ListItem button>
              <TableChartOutlined />
              <ListItemText primary="Board" />
            </ListItem>
          </NavLink>

          <Divider />

          <NavLink to="/login">
            <ListItem button>
              <AccountCircleOutlined />
              <ListItemText primary="Login" />
            </ListItem>
          </NavLink>
        </List>


      </div>
    )

    return (
      <React.Fragment>

        <IconButton className={classes.menuButton} onClick={() => this.toggleSideDrawer(true)} color="inherit" aria-label="Menu">
          <MenuSharp />
        </IconButton>

        <Drawer open={this.state.openSideDrawer} onClose={() => this.toggleSideDrawer(false)}>

          <div
            tabIndex={0}
            role="button"
            onClick={() => this.toggleSideDrawer(false)}
            onKeyDown={() => this.toggleSideDrawer(false)}
          >
            {sideList}
          </div>

        </Drawer>

      </React.Fragment>
    )
  }
};

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideDrawer);