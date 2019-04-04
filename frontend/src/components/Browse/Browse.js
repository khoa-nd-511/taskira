import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Paper,
  Button,
  Chip,
  Avatar
} from '@material-ui/core';
import {
  ErrorOutlineRounded,
  ArrowDropUpRounded,
  ArrowDropDownRounded
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import * as actions from '../../store/actions';
import Spinner from '../UI/Spinner/Spinner';

const styles = theme => console.log(theme) || ({
  root: {
    ...theme.typography.body1
  },
  header: {
    ...theme.typography.h4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    boxShadow: theme.shadows[0],
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    fontSize: '10px',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2
  },
  customChip: {
    fontSize: '12px',
    marginLeft: '20px'
  },
  prio: {
    ...theme.typography.subtitle2,
    marginLeft: theme.spacing.unit * (6 / 8),
    fontWeight: 'bold'
  },
  div: {
    marginBottom: theme.spacing.unit * 1.5
  },
  item2: {
    order: 3,
    [theme.breakpoints.up('lg')]: {
      order: 2,
    },
  },
  item3: {
    order: 2,
    [theme.breakpoints.up('lg')]: {
      order: 3,
    },
  },
  centeringChildren: {
    display: 'flex',
    alignItems: 'center'
  }
})

export class Browse extends Component {
  state = {
    currentTicket: null
  };

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
    const { classes } = this.props;

    let ticketDetail = null;

    if (this.props.loading) {
      ticketDetail = <Spinner />
    } else if (!this.props.selectedTicket) {
      ticketDetail = 'Browse ticket failed ...'
    } else {
      localStorage.setItem('selectedTicket', JSON.stringify(this.props.selectedTicket._id));

      const {
        title,
        label,
        description,
        hiPri,
        createdDate,
        creator,
        assignee } = this.props.selectedTicket;

      ticketDetail = (
        <Grid container spacing={16} className={classes.root}>
          {/* Title Section */}
          <Grid item xs={12} className={classes.header} order={1}>
            <h4 className={classes.headerText} style={{ margin: 0 }}>{title}</h4>
          </Grid>

          {/* Left Section */}
          <Grid item xs={12} lg={8} className={classes.item2}>
            <Grid container>
              {/* Ticket Details */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <div className={classes.div}>
                    <b>Status:</b>
                    <Button color="primary" variant="contained" className={classes.button}>Ready To Start</Button>
                  </div>


                  <div className={classes.div}>
                    <b>Label:</b>
                    <Chip
                      avatar={<Avatar><ErrorOutlineRounded /></Avatar>}
                      label={label}
                      className={[classes.chip, classes.customChip].join(' ')}
                      color={label === 'develop' ? "primary" : "secondary"}
                    />
                  </div>


                  <div className={[classes.div, classes.centeringChildren].join(' ')}>
                    <b style={{ color: 'black' }}>Priority:</b>
                    <span
                      className={[classes.prio, classes.centeringChildren].join(' ')}
                      style={{ color: hiPri ? "red" : "blue" }}
                    >
                      {hiPri ? <ArrowDropUpRounded color="secondary" /> : <ArrowDropDownRounded color="primary" />}
                      {hiPri ? 'Urgent' : 'Normal'}
                    </span>
                  </div>
                </Paper>
              </Grid>

              {/* Ticket Description */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p><b>Description:</b> {description}</p>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} lg={4} className={classes.item3}>
            <Grid container>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p><b>Reporter:</b> {creator.email}</p>
                  <p><b>Assignee:</b> {assignee ? assignee.email : null}</p>
                  <p><b>Created At:</b> {new Date(+createdDate).toISOString().slice(0, 10)}</p>
                  <p><b>Updated At:</b> {new Date(+createdDate).toISOString().slice(0, 10)}</p>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )
    }

    return ticketDetail;
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

export default connect(maptStateToProps, mapDispatchToProps)(withStyles(styles)(Browse));
