import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withSnackbar } from 'notistack';
import { Subject, empty, fromEvent, of } from 'rxjs';
import { debounceTime, tap, switchMap, takeUntil, delay, filter, } from 'rxjs/operators';

import { Grid, Paper, ClickAwayListener, } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Autocomplete from "../Form/Autocomplete/Autocomplete";
import Spinner from '../UI/Spinner/Spinner';
import * as actions from '../../store/actions';
import RightSection from './RightSection/RightSection';
import LeftUpperSection from './LeftUpperSection/LeftUpperSection';

import { styles } from './helper';

export class Browse extends Component {
  inputSubject = new Subject();
  inputSource$ = null;

  state = {
    currentTicket: null,
    assigneeFieldObj: {
      name: 'assignee',
      type: 'email',
      placeholder: 'Assign to email',
    },
    suggestions: [],
    showList: false,
    showActions: false,
    reAssign: false,
    searchingFor: '',
    textInput: '',
    longClickDetected: false,
    showStatusList: false,
  };

  onHandleInputChanged = e => {
    this.inputSubject.next(e);
  }

  onSelectAssignee = email => {
    this.setState({ showList: false, textInput: email, showActions: true })
  }

  onAssign = () => {
    const token = localStorage.getItem('token');
    const dataObj = {
      userEmail: this.state.textInput,
      ticketId: this.props.selectedTicket._id,
      token
    }

    this.props.onAssignTicket(dataObj);
    this.setState({ reAssign: false });
  }

  handleClickAway = e => {
    this.setState({ showList: false })
  }

  resetState = () => {
    this.setState({ suggestions: [], showList: false, searchingFor: '' });
    return empty();
  }

  fetchUsersByEmail = text => {
    const reqBody = {
      query: `
        query SearchUsers($text: String!) {
          searchUsers(text: $text) {
            name
            email
          }
        }`,
      variables: {
        text
      }
    }

    return fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    }).then(data => data.json())
  }

  switchToAutoComplete = email => {
    this.setState({
      reAssign: true,
      textInput: email
    })
  }

  updateStatusHandler = (status) => {
    if (['resolved', 'invalid'].includes(status)) return;

    const { longClickDetected } = this.state;
    if (longClickDetected) {
      this.setState({ longClickDetected: false })
      return;
    }

    this.props.onUpdateTicketStatus(this.props.selectedTicket._id, status);
  }

  componentDidMount = () => {
    const isLoggedIn = localStorage.getItem('userId') !== null;
    if (!isLoggedIn) {
      this.props.history.push('/login');
    }

    const currentTicketId = JSON.parse(localStorage.getItem('selectedTicket'))
    if (currentTicketId !== null) {
      this.props.onBrowseTicket(currentTicketId);
    }

    this.inputSource$ = this.inputSubject.pipe(
      tap(val => this.setState({ suggestions: [], showList: false, searchingFor: val, textInput: val, showActions: false })),
      debounceTime(250),
      switchMap(txt => txt !== '' ? this.fetchUsersByEmail(txt) : this.resetState()),
    );

    this.inputSource$.subscribe(({ data }) => {
      const { searchUsers } = data;
      this.setState({ suggestions: searchUsers, showList: true, searchingFor: '' });
    });

    const clicksOnBtn = target => (
      target === document.querySelector('#statusBtn') ||
      target === document.querySelector('#statusBtn span')
    )

    const mouseUp$ = fromEvent(document, 'mouseup');
    const mouseDown$ = fromEvent(document, 'mousedown');

    const clickAndHold$ = mouseDown$.pipe(
      switchMap(e => (
        of(e).pipe(
          tap(this.setState({ showStatusList: false })),
          filter(e => clicksOnBtn(e.target)),
          delay(1000),
          takeUntil(mouseUp$),
        )
      )),
    );

    clickAndHold$.subscribe(e => {
      this.setState({ longClickDetected: true, showStatusList: true });
    });
  }

  componentWillUnmount() {
    this.props.onClearCurrentSelectedTicket();
    this.inputSource$.unsubscribe();
  }

  render() {
    const { classes, assigning, selectedTicket, loading, error } = this.props;
    const { assigneeFieldObj, suggestions, showList, searchingFor, textInput, showActions, reAssign, showStatusList } = this.state;
    let dynamicClasses = [classes.paper];

    if (assigning) {
      dynamicClasses.push(classes.cover);
    } else {
      dynamicClasses = [classes.paper];
    };

    let ticketDetail = null;

    if (loading && !selectedTicket) {
      ticketDetail = <Spinner />
    } else if (!selectedTicket) {
      ticketDetail = 'Browse ticket failed ...'
    } else {
      localStorage.setItem('selectedTicket', JSON.stringify(selectedTicket._id));
      const { _id, title, label, description, hiPri, createdDate, updatedDate, creator, assignee, status } = selectedTicket;

      let assigneeField = null;
      if (assignee !== null && !reAssign) {
        assigneeField = <p><b>Assignee:</b> <span className={classes.hoverable} onMouseDown={() => this.switchToAutoComplete(assignee.email)}>{' ' + assignee.email}</span></p>;
      } else {
        assigneeField = (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Autocomplete
              data={assigneeFieldObj}
              assign={this.onAssign}
              inputChanged={this.onHandleInputChanged}
              assigneeSelected={this.onSelectAssignee}
              inputFocused={() => this.setState({ showList: true })}
              cancelReassign={() => this.setState({ reAssign: false })}
              showList={showList}
              suggestions={suggestions}
              searchingFor={searchingFor === '' ? '' : searchingFor}
              inputVal={textInput}
              showActions={showActions}
              reAssign={reAssign}
            />
          </ClickAwayListener>
        )
      }

      if (error) {
        this.props.enqueueSnackbar(error.message, { variant: "warning" })
      }

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
              <LeftUpperSection
                classes={classes}
                showStatusList={showStatusList}
                _id={_id}
                hiPri={hiPri}
                label={label}
                status={status}
                reUpdateTicketStatus={this.props.onUpdateTicketStatus}
                updateTicketStatus={this.updateStatusHandler}
              />

              {/* Ticket Description */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <p><b>Description:</b> {description}</p>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <RightSection
            item3Class={classes.item3}
            dynamicClasses={dynamicClasses}
            createdDate={createdDate}
            updatedDate={updatedDate}
            creator={creator}
          >
            {assigneeField}
          </RightSection>
        </Grid >
      )
    }

    return ticketDetail;
  }
}

const maptStateToProps = state => {
  return {
    selectedTicket: state.ticket.selectedTicket,
    loading: state.ticket.loading,
    error: state.ticket.error,
    userId: state.auth.userId,
    assigning: state.ticket.assigning,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onBrowseTicket: id => dispatch(actions.browseTicket(id)),
    onClearCurrentSelectedTicket: () => dispatch(actions.clearCurrentSelectedTicket()),
    onAssignTicket: dataObj => dispatch(actions.assignTicket(dataObj)),
    onUpdateTicketStatus: (id, status) => dispatch(actions.updateTicketStatus(id, status))
  }
}

export default connect(maptStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(Browse)));
