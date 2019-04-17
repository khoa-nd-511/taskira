import React from 'react'
import { Grid, Paper } from '@material-ui/core'

const commentSection = props => {
  const { classes } = props;
  return (
    <Grid item xs={12} className={classes.item4}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <p style={{ marginBottom: 0 }}><b>Comments:</b></p>

              <p style={{textAlign: 'left'}}><b>Khoa Ng: </b> xxxxxxxxxxxxxxxxxxxxxxxx</p>
              <p style={{textAlign: 'right'}}><b>Test Ng: </b> yyyyyyyyyyyyyyyyyyyyy</p>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default commentSection
