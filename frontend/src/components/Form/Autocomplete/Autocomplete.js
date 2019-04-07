import React, { Component } from 'react'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, skipWhile } from 'rxjs/operators';

import { InputLabel, Input, FormControl } from '@material-ui/core';

export default class Autocomplete extends Component {
  inputSubject = new Subject();
  inputSource$ = null;

  state = {
    suggestions: [],
    searchPlaceholder: '',
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
      skipWhile(v => v.trim().length === 0),
      tap(val => this.setState({ suggestions: [], searchPlaceholder: `Seaching for ${val}...`, })),
      debounceTime(500),
      distinctUntilChanged(),
    );

    this.inputSource$.pipe(
      skipWhile(v =>v === ''),
      switchMap(txt => this.fetchUsersByEmail(txt))
    ).subscribe(({ data }) => {
      const { searchUsers } = data;
      this.setState({ suggestions: searchUsers, searchPlaceholder: '' })
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
        />
        {this.state.searchPlaceholder !== '' ? <p style={{ textAlign: 'right' }}>{this.state.searchPlaceholder}</p> : null}
      </FormControl>
    )
  }
}
