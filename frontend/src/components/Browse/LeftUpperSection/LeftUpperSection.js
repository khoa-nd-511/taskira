import React from 'react';

import { Menu, MenuItem, Button, Grid, Paper, Chip, Avatar } from '@material-ui/core';
import { ErrorOutlineRounded, ArrowDropDownRounded, ArrowDropUpRounded } from '@material-ui/icons';

import { getStatus, displayStatus, statusList } from '../helper';

const leftUpperSection = props => {
  const {
    classes,
    showStatusList,
    reUpdateTicketStatus,
    updateTicketStatus,
    _id,
    hiPri,
    label,
    status,
  } = props;

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <div className={classes.div}>
          <b>Status:</b>
          <Button
            id="statusBtn"
            color="primary"
            variant="contained"
            className={[classes.button, classes.buttonRelative].join(' ')}
            onClick={() => updateTicketStatus(status)}
          >
            {displayStatus(status)}
            <Menu
              open={showStatusList}
              anchorEl={showStatusList ? document.querySelector('#statusBtn') : null}
            >
              {
                statusList.map((s, i) => {
                  return <MenuItem key={s} onClick={() => reUpdateTicketStatus(_id, getStatus(i))}>{displayStatus(s)}</MenuItem>
                })
              }
            </Menu>
          </Button>
        </div>
        <div className={classes.div}>
          <b>Label:</b>
          <Chip
            avatar={<Avatar><ErrorOutlineRounded /></Avatar>}
            label={label}
            className={[classes.chip, classes.customChip].join(' ')}
            color={label === 'develop' ? "primary" : "secondary"}
          />
        </div>
        <div className={[classes.div, classes.centeringChildren].join(' ')}>
          <b style={{ color: 'black' }}>Priority:</b>
          <span
            className={[classes.prio, classes.centeringChildren].join(' ')}
            style={{ color: hiPri ? "red" : "blue" }}
          >
            {hiPri ? <ArrowDropUpRounded color="secondary" /> : <ArrowDropDownRounded color="primary" />}
            {hiPri ? 'Urgent' : 'Normal'}
          </span>
        </div>
      </Paper>
    </Grid>
  )
}

export default leftUpperSection;
