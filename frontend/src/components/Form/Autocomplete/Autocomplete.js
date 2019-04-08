import React, { Component } from 'react'
import { Subject, empty } from 'rxjs';
import {
  debounceTime,
  tap,
  switchMap,
} from 'rxjs/operators';

import { withStyles } from '@material-ui/core/styles';
import {
  InputLabel,
  Input,
  FormControl,
  ListItem,
  List,
  ListItemText,
  ListSubheader,
  ClickAwayListener
} from '@material-ui/core';

const styles = theme => {
  const { transitions, shadows } = theme;
  return {
    positionRelative: {
      position: 'relative'
    },
    suggestions: {
      position: 'absolute',
      width: '100%',
      top: '100%',
      left: 0,
      padding: 0,
      margin: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      listStyle: 'none',
      boxSizing: 'border-box',
      borderRadius: `0 0 4px 4px`,
      boxShadow: shadows['2']
    },
    suggestionItem: {
      transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeOut}`,
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      '&:hover': {
        background: '#f7f7f7',
        fontWeight: 'bold'
      }
    },
    list: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }
}


class Autocomplete extends Component {
  inputSubject = new Subject();
  inputSource$ = null;

  state = {
    suggestions: [],
    searchPlaceholder: '',
    open: false
  }

  resetState = () => {
    this.setState({ suggestions: [], searchPlaceholder: '', open: false });
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

  componentDidMount() {
    this.inputSource$ = this.inputSubject.pipe(
      tap(val => this.setState({ suggestions: [], searchPlaceholder: `Seaching for ${val}...`, open: false })),
      debounceTime(250),
      switchMap(txt => txt !== '' ? this.fetchUsersByEmail(txt) : this.resetState()),
    );

    this.inputSource$.subscribe(({ data }) => {
      const { searchUsers } = data;
      this.setState({
        suggestions: searchUsers,
        searchPlaceholder: '',
        open: true
      });
    });
  }

  componentWillUnmount() {
    this.inputSource$.unsubscribe()
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickAway = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { placeholder, type } = this.props.data;
    const { suggestions, open } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <FormControl
          margin="normal"
          required
          fullWidth
          style={{ margin: 0 }}
          className={classes.positionRelative}>

          <InputLabel htmlFor={type}>{placeholder}</InputLabel>
          <Input
            id={type}
            name={type}
            type={type}
            onChange={e => this.inputSubject.next(e.target.value)}
            autoComplete="off"
          />

          {open > 0 && (
            <List
              component="nav"
              subheader={
                <ListSubheader component="div">
                  {!suggestions.length
                    ? 'Found no users..'
                    : suggestions.length > 1 
                      ? `Found ${suggestions.length} users`
                      : `Found 1 user`}
                </ListSubheader>
              }
              className={[classes.list, classes.suggestions].join(' ')}
            >
              {suggestions.map(s => {
                return (
                  <ListItem button key={s.email} onClick={() => { }}>
                    <ListItemText inset primary={`${s.email} (${s.name})`} style={{padding: 0}} />
                  </ListItem>
                )
              })}
            </List>
          )}

          {this.state.searchPlaceholder !== '' ? <p style={{ textAlign: 'right' }}>{this.state.searchPlaceholder}</p> : null}
        </FormControl>
      </ClickAwayListener>
    )
  }
}

export default withStyles(styles)(Autocomplete);