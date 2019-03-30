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
      rows: [],
      page: 0,
      rowsPerPage: 5
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

    const reqBody = {
      query: `
        query {
          getTickets {
            title
            description
            hiPri
            label
            creator {
              email
            }
          }
        }`
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })
      .then(data => data.json())
      .then(tickets => {
        const rowsData = [];

        for (const [i, ticket] of tickets.data.getTickets.entries()) {
          rowsData.push(
            this.createData(i + 1, ticket)
          )
        }
        if (this._isMounted) {
          this.setState({ rows: rowsData })
        }
      })
      .catch(err => console.log(err))
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    const { rows, page, rowsPerPage } = this.state
    let bodyRows = null;

    if (rows.length > 0) {
      bodyRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(r => {
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

    let table = (
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
                count={rows.length}
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

    if (!rows.length) {
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
    isLoggedIn: state.isLoggedIn
  }
}

export default connect(mapStateToProps, null)(withStyles(styles)(withSnackbar(TicketTable)));