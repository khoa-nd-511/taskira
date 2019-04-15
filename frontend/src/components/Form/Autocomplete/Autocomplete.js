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
  Button
} from '@material-ui/core';
import {
  CheckCircleOutlineTwoTone,
  CancelOutlined
} from '@material-ui/icons';

const styles = theme => {
  const { transitions, shadows, spacing, palette } = theme;
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
      padding: `${spacing.unit}px ${spacing.unit * 2}px`,
      '&:hover': {
        background: '#f7f7f7',
        fontWeight: 'bold'
      }
    },
    list: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: palette.background.paper,
    },
    actions: {
      position: 'absolute',
      top: '50%',
      right: spacing.unit,
      transform: 'translateY(-50%)'
    },
    button: {
      [theme.breakpoints.up('lg')]: {
        minWidth: 'unset',
      }
    }
  }
}

const autocomplete = props => {

  const {
    classes,
    suggestions,
    showList,
    showActions,
    searchingFor,
    inputVal,
    inputChanged,
    inputFocused,
    assigneeSelected,
    assign,
    reAssign,
    cancelReassign
  } = props;
  const { placeholder, type } = props.data;

  let actions = null;
  if (showActions) {
    actions = (
      <div className={classes.actions}>
        <Button onClick={assign} className={classes.button}>
          <CheckCircleOutlineTwoTone />
        </Button>
      </div>
    )
  }
  
  if (reAssign && searchingFor === '') {
    actions = (
      <div className={classes.actions}>
        <Button onClick={cancelReassign} className={classes.button}>
          <CancelOutlined />
        </Button>
      </div>
    )
  }

  if (showActions && reAssign) {
    actions = (
      <div className={classes.actions}>
        <Button onClick={assign} className={classes.button}>
          <CheckCircleOutlineTwoTone />
        </Button>
        <Button onClick={cancelReassign} className={classes.button}>
          <CancelOutlined />
        </Button>
      </div>
    )
  }

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
        value={inputVal}
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
              <ListItem button key={s.email} onClick={() => assigneeSelected(s.email)}>
                <ListItemText inset primary={`${s.email} (${s.name})`} style={{ padding: 0 }} />
              </ListItem>
            )
          })}
        </List>
      )}

      {searchingFor !== '' && (
        <p style={{ textAlign: 'right', fontSize: '12px' }}>
          Searching for {searchingFor}...
        </p>
      )}

      {actions}

    </FormControl>
  )
}


export default withStyles(styles)(autocomplete);