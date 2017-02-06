"use strict";

import {IndexRoute, Route, Router, hashHistory} from "react-router";
import React, {Component} from "react";
import {Container} from "flux/utils";
import VoteResult from "./components/vote-result";
import Error from "../common/components/error";
import ErrorStore from "../common/stores/error-store";
import EventAction from "./actions/event-action";
import EventStore from "./stores/event-store";
import StatusAction from "./actions/status-action";
import StatusStore from "./stores/status-store";
import AnswerStore from "./stores/answer-store";
import {render} from "react-dom";
import Url from "url";
import qs from "querystring";
import uuid from "uuid";

const url = Url.parse(location.href);
const query = qs.parse(url.query);
const eventId = query.id;

import Header from "./components/header";
import Footer from "./components/footer";

import MQTTApp from "./rpc";
const app = MQTTApp({prefix: query.prefix});
app.connect(query.broker);
app.listen(query.broker);

class App extends Component {
  static getStores(){
    return [
      ErrorStore,
      EventStore,
      StatusStore,
      AnswerStore
    ];
  }
  static calculateState(state){
    return {
      error: ErrorStore.getState(),
      event: EventStore.getState(),
      status: StatusStore.getState(),
      answers: AnswerStore.getState()
    };
  }
  componentDidMount(){
    EventAction.fetch(app, eventId);
  }
  render (){
    // console.log(this.state);
    return <div className="row">
      <Header event={this.state.event} />
      {React.cloneElement(this.props.children, {data: this.state, app})}
      <Error error={this.state.error} />
      <Footer event={this.state.event} />
      </div>;
  }
};

const router = <Router history={hashHistory}>
        <Route path="/" component={Container.create(App)}>
        <IndexRoute component={VoteResult} />
        </Route>
  </Router>;
render(router, document.querySelector("#app"));
