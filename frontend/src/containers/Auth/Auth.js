import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { AccountCircleSharp } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  CssBaseline,
  Button,
  Avatar
} from '@material-ui/core';

import { withSnackbar } from 'notistack'

import Form from '../../components/Form/Form';
// import AlertSnackbar from '../../components/UI/AlertSnackbar/AlertSnackbar';

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
      },
      token: null
    }
  }

  onSubmitHandler = e => {
    e.preventDefault();

    const email = this.state.form.fields.email.reference.current.value;
    const password = this.state.form.fields.password.reference.current.value;

    const reqBody = {
      query: `
        query {
          signIn(userInput: {email: "${email}", password: "${password}"}) {
            userId
            token
          }
        }
      `
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          this.props.enqueueSnackbar(data.errors[0].message, {
            variant: 'warning',
          });
        } else {
          localStorage.setItem('token', data.data.signIn.token)
          this.props.enqueueSnackbar('Login successfully', {
            variant: 'success',
          });
          this.props.history.push('/')
        }
      })
      .catch(err => console.log(err))
  };

  componentDidMount() {
    const token = localStorage.getItem('token');

    this.setState({ token })
  }

  render() {
    const { classes } = this.props;

    const isLogin = this.state.token !== null;

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

export default withSnackbar(withStyles(styles)(Auth));
