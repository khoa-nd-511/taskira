import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  AccountCircleOutlined,
  ExitToAppOutlined
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
    openSideDrawer: false,
    token: null
  }

  toggleSideDrawer = open => {
    this.setState({ openSideDrawer: open })
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    this.setState({ token })
  }

  render() {
    const { classes } = this.props;

    const isLogin = this.props.token !== null;

    const sideList = (
      <div className={[classes.list, "side-list"].join(' ')} >
        <List>
          <NavLink to="/" exact>
            <ListItem button>
              <Dashboard />
              <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>
          <NavLink to="/create">
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

          {isLogin
            ? (
              <React.Fragment>
                <NavLink to="/me">
                  <ListItem button>
                    <AccountCircleOutlined />
                    <ListItemText primary="My Account" />
                  </ListItem>
                </NavLink>
                <NavLink to="/logout">
                  <ListItem button>
                    <ExitToAppOutlined />
                    <ListItemText primary="Logout" />
                  </ListItem>
                </NavLink>
              </React.Fragment>
            )
            : (
              <NavLink to="/login">
                <ListItem button>
                  <AccountCircleOutlined />
                  <ListItemText primary="Login" />
                </ListItem>
              </NavLink>
            )}
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

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

export default connect(mapStateToProps, null)(withStyles(styles)(SideDrawer));