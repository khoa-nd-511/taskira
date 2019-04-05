import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../store/actions'
import Form from '../../components/Form/Form';

import {
  Paper, Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.typography.body1
  },
  header: {
    ...theme.typography.h4,
    padding: `0px ${theme.spacing.unit * 2}px`,
    boxShadow: theme.shadows[0],
    marginBottom: theme.spacing.unit * 2.5
  },
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2.5}px`
  },
})

export class Create extends Component {
  constructor(props) {
    super(props)

    this.titleRef = React.createRef();
    this.descRef = React.createRef();
    this.labelRef = React.createRef();

    this.state = {
      form: {
        fields: {
          title: {
            name: 'title',
            type: 'text',
            placeholder: 'Title',
            validation: {
              required: true,
            },
            valid: false,
            touched: false,
            reference: this.titleRef
          },
          description: {
            name: 'description',
            type: 'text',
            placeholder: 'Description',
            validation: {
              required: true,
            },
            valid: false,
            touched: false,
            reference: this.descRef
          },
          label: {
            name: 'label',
            type: 'select',
            placeholder: 'Label',
            options: {
              develop: {
                selected: true,
                label: "Develop"
              },
              bug: {
                selected: false,
                label: "Bug"
              }
            },
            validation: {
              required: true,
            },
            valid: false,
            touched: false,
            reference: this.labelRef
          },
          hiPri: {
            name: 'hiPri',
            type: 'radio',
            checked: true,
            validation: {
              required: true,
            },
            valid: false,
            touched: false
          },
        }
      }
    }
  }

  onSubmitHandler = e => {
    e.preventDefault();

    const { fields } = this.state.form;
    const selectedLabel = Object.keys(fields.label.options).filter(o => fields.label.options[o].selected)[0];
    const currentUser = localStorage.getItem('userId');

    const ticketInput = {
      title: this.titleRef.current.value,
      description: this.descRef.current.value,
      hiPri: fields.hiPri.checked,
      label: selectedLabel,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      creator: currentUser
    }

    this.props.onCreateTicket(ticketInput);
    this.props.history.push('/browse');
  }

  onSwitchHandler = value => {
    const updatedPriority = { ...this.state.form.fields.hiPri };
    updatedPriority.checked = value;

    const updatedForm = { ...this.state.form };
    updatedForm.fields.hiPri = updatedPriority;

    this.setState({
      form: updatedForm
    })
  }

  onSelectHandler = value => {
    const updatedLabel = { ...this.state.form.fields.label }
    Object.keys(updatedLabel.options).forEach(l => {
      if (value === l) {
        updatedLabel.options[l].selected = true;
      } else {
        updatedLabel.options[l].selected = false;
      }
    });

    const updatedForm = { ...this.state.form };
    updatedForm.fields.label = updatedLabel;

    this.setState({
      form: updatedForm
    })
  }

  componentDidMount = () => {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login')
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        {!localStorage.getItem('token') && <Redirect to="/login" />}

        <div className={classes.root}>
          <div className={classes.header}>
            <p style={{ margin: 0 }}>Create new ticket</p>
          </div>


          <Paper className={classes.paper}>
            <form className={classes.form} onSubmit={this.onSubmitHandler}>
              <Form
                formFields={this.state.form.fields}
                switched={this.onSwitchHandler}
                selected={this.onSelectHandler}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit
            </Button>
            </form>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchtoProps = dispatch => {
  return {
    onCreateTicket: data => dispatch(actions.createTicket(data)),
    onBrowseTicket: id => dispatch(actions.browseTicket(id))
  }
}

export default connect(mapStateToProps, mapDispatchtoProps)(withStyles(styles)(Create));
