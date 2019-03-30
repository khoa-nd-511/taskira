import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper
} from '@material-ui/core';

import * as actions from '../../store/actions'
import TicketTablePagination from './TicketTablePagination/TicketTablePagination';
import Spinner from '../../components/UI/Spinner/Spinner';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

export class TicketTable extends Component {
  _isMounted = false

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 4
    };
  }

  createData = (id, ticketsData) => {
    const { title, description, hiPri, label, creator } = ticketsData;
    const creatorEmail = creator.email;
    return { id, title, description, hiPri, label, creatorEmail };
  }

  onChangePageHandler = (_, page) => {
    this.setState({ page })
  }

  onChangeRowsPerPageHandler = e => {
    this.setState({ page: 0, rowsPerPage: e.target.value });
  };

  componentDidMount() {
    this._isMounted = true;

    if (!this.props.tickets.length) {
      this.props.onLoadTickets();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes, tickets, loading } = this.props;
    const { page, rowsPerPage } = this.state
    let bodyRows = null;
    const rowsData = [];
    let table = null;

    if (this.props.error) {
      table = <p>Please try refresh the page!!!</p>
      this.props.enqueueSnackbar('Something went wrong ...:(', {
        variant: 'danger'
      })
    } else {
      for (const [i, t] of tickets.entries()) {
        rowsData.push(
          this.createData(i + 1, t)
        )
      }
    }

    if (rowsData.length > 0) {
      bodyRows = rowsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => {
        return (
          <TableRow key={r.id}>
            <TableCell>{r.title}</TableCell>
            <TableCell>{r.description}</TableCell>
            <TableCell>{r.hiPri ? 'Urgent' : 'Normal'}</TableCell>
            <TableCell>{r.label}</TableCell>
            <TableCell>{r.creatorEmail}</TableCell>
          </TableRow>
        )
      })
    }

    table = (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Creator</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyRows}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[4, 8, 12]}
                count={rowsData.length}
                rowsPerPage={+rowsPerPage}
                page={page}
                SelectProps={{
                  native: true
                }}
                onChangePage={this.onChangePageHandler}
                onChangeRowsPerPage={this.onChangeRowsPerPageHandler}
                ActionsComponent={TicketTablePagination}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );

    if (loading) {
      table = <Spinner />
    }

    return table;
  }
}

TicketTable.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    tickets: state.ticket.tickets,
    loading: state.ticket.loading,
    ticketError: state.ticket.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoadTickets: () => dispatch(actions.loadTickets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(TicketTable)));