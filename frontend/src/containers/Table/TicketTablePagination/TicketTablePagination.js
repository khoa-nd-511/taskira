import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  FirstPageOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageOutlined,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginleft: theme.spacing.unit * 2.5
  }
})

class TicketTablePagination extends Component {

  toFirstPageHandler = e => {
    this.props.onChangePage(e, 0)
  }

  toLastPageHandler = e => {
    this.props.onChangePage(
      e,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }

  toNextPageHandler = e => {
    this.props.onChangePage(e, this.props.page + 1)
  }

  toPrevPageHandler = e => {
    this.props.onChangePage(e, this.props.page - 1)
  }

  render() {
    const { classes, count, page, rowsPerPage } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.toFirstPageHandler}
          disabled={page === 0}
        >
          <FirstPageOutlined />
        </IconButton>
        <IconButton
          onClick={this.toPrevPageHandler}
          disabled={page === 0}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.toNextPageHandler}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.toLastPageHandler}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <LastPageOutlined />
        </IconButton>
      </div>
    )
  }
}

TicketTablePagination.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(
  TicketTablePagination,
);