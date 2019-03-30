import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import { AccountCircleSharp } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  CssBaseline,
  Button,
  Avatar
} from '@material-ui/core';

import { withSnackbar } from 'notistack';

import Form from '../../components/Form/Form';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.dark,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

export class Auth extends Component {
  constructor(props) {
    super(props)

    this.emailElem = React.createRef();
    this.pwdElem = React.createRef();

    this.state = {
      form: {
        name: 'Sign In',
        fields: {
          email: {
            name: 'email',
            type: 'email',
            placeholder: 'Email Address',
            validation: {
              required: true,
              pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/
            },
            valid: false,
            touched: false,
            reference: this.emailElem
          },
          password: {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            valid: false,
            touched: false,
            reference: this.pwdElem
          }
        }
      }
    }
  }

  onSubmitHandler = e => {
    e.preventDefault();

    const email = this.state.form.fields.email.reference.current.value;
    const password = this.state.form.fields.password.reference.current.value;

    this.props.onCheckAuth(email, password);
  };

  componentWillUnmount() {
    if(this.props.isLoggedIn) {
      this.props.enqueueSnackbar('Signed in successfully', {
        variant: 'success'
      })
    }
  }

  render() {
    const { classes, error, token } = this.props;

    const isLogin = token !== null;

    if (error) {
      this.props.enqueueSnackbar(error.message, {
        variant: 'warning'
      })
    };

    return (
      <main className={classes.main}>
        {isLogin && <Redirect to="/" />}
        <CssBaseline />

        <Paper className={classes.paper}>

          <Avatar className={classes.avatar}>
            <AccountCircleSharp />
          </Avatar>

          <Typography component="h1" variant="h5">
            {this.props.formName}
          </Typography>

          <form
            className={classes.form}
            onSubmit={this.onSubmitHandler}
          >

            <Form formFields={this.state.form.fields} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>

          </form>
        </Paper>
      </main>
    )
  }
}

Auth.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    error: state.auth.error,
    isLoggedIn: state.auth.isLoggedIn
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckAuth: (e, p) => dispatch(actions.checkAuth(e, p)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(withStyles(styles)(Auth)));
