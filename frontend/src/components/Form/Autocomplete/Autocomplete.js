import React, { Component } from 'react'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { InputLabel, Input, FormControl } from '@material-ui/core';

export default class Autocomplete extends Component {
  keyUp = new Subject();
  inputSource$ = null;

  state = {
    suggestions: [],
    placeholder: '',
  }

  componentDidMount() {
    this.inputSource$ = this.keyUp.pipe(
      map(e => e.target.value),
      filter(v => v.trim() !== ''),
      tap(t => this.setState({ placeholder: `Seaching for ${t}...` })),
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(_ => this.setState({ placeholder: '' }));
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
          onChange={e => this.keyUp.next(e)}
        />
        {this.state.placeholder !== '' ? <p style={{ textAlign: 'right' }}>{this.state.placeholder}</p> : null}
      </FormControl>
    )
  }
}
