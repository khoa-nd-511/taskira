import React from 'react'
import { Grid, Paper } from '@material-ui/core'

const commentSection = props => {
  const { classes, comments, currentUser } = props;
  return (
    <Grid item xs={12} className={classes.item4}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <p style={{ marginBottom: 0 }}><b>Comments:</b></p>

            {comments.map(c => (
              <p
                key={c._id}
                style={{ textAlign: c.user._id.toString() === currentUser.toString() ? 'right' : 'left' }}
              >
                <b>{c.user.name}:</b> {c.content}
              </p>)
            )}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default commentSection
