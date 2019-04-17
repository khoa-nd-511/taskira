import React from 'react';
import { Grid, Paper } from '@material-ui/core'

const rightSection = props => {
  const {
    item3Class,
    dynamicClasses,
    createdDate,
    updatedDate,
    creator
  } = props;

  return (
    <Grid item xs={12} lg={4} className={item3Class}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={dynamicClasses.join(' ')}>
            <p style={{ marginBottom: 0 }}><b>Reporter:</b> {creator.email}</p>
            {props.children}
            <p><b>Created At:</b> {new Date(+createdDate).toLocaleString()}</p>
            <p><b>Updated At:</b> {new Date(+updatedDate).toLocaleString()}</p>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default rightSection

