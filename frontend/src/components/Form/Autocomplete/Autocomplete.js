import React, { Component } from 'react'
import { Subject, empty } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from 'rxjs/operators';

import { InputLabel, Input, FormControl } from '@material-ui/core';

export default class Autocomplete extends Component {
  inputSubject = new Subject();
  inputSource$ = null;

  state = {
    suggestions: [],
    searchPlaceholder: '',
  }

  resetState = () => {
    this.setState({ suggestions: [], searchPlaceholder: '' });
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
      tap(val => this.setState({ suggestions: [], searchPlaceholder: `Seaching for ${val}...` })),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(txt => txt !== '' ? this.fetchUsersByEmail(txt) : this.resetState()),
    );

    this.inputSource$.subscribe(({ data }) => {
      const { searchUsers } = data;
      this.setState({ suggestions: searchUsers, searchPlaceholder: '' });
    });
  }

  componentWillUnmount() {
    this.inputSource$.unsubscribe()
  }

  render() {
    const { placeholder, type } = this.props.data;

    return (
      <FormControl margin="normal" required fullWidth style={{ margin: 0 }}>
        <InputLabel htmlFor={type}>{placeholder}</InputLabel>
        <Input
          id={type}
          name={type}
          type={type}
          onChange={e => this.inputSubject.next(e.target.value)}
          autoComplete="off"
        />
        {this.state.searchPlaceholder !== '' ? <p style={{ textAlign: 'right' }}>{this.state.searchPlaceholder}</p> : null}
      </FormControl>
    )
  }
}
