import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import {
  InputLabel,
  Input,
  FormControl,
  ListItem,
  List,
  ListItemText,
  ListSubheader,
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
const autocomplete = props => {

  const { classes, inputChanged, suggestions, showList, searchingFor, inputFocused } = props;
  const { placeholder, type } = props.data;

  return (
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
          autoComplete="off"
          onChange={e => inputChanged(e.target.value)}
          onClick={inputFocused}
        />

        {(suggestions.length > 0 && showList) && (
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
                  <ListItemText inset primary={`${s.email} (${s.name})`} style={{ padding: 0 }} />
                </ListItem>
              )
            })}
          </List>
        )}

        {searchingFor !== null ? <p style={{ textAlign: 'right' }}>Searching for {searchingFor}...</p> : null}
      </FormControl>
  )
}


export default withStyles(styles)(autocomplete);