import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Auth from './containers/Auth/Auth'
import CreateTicketForm from './containers/CreateTicketForm/CreateTicketForm'
import Board from './containers/Board/Board'
import Table from './containers/Table/Table'
import Layout from './hoc/Layout/Layout';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/board" component={Board} />
            <Route path="/create" component={CreateTicketForm} />
            <Route path="/login" component={Auth} />
            <Route exact path="/" component={Table} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
