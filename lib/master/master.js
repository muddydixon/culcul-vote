"use strict";

import {IndexRoute, Route, Router, hashHistory} from "react-router";
import React, {Component} from "react";
import {Container} from "flux/utils";
import ErrorStore from "../common/stores/error-store";
import EventAction from "./actions/event-action";
import EventDetail from "./components/event-detail";
import EventStore from "./stores/event-store";
import StatusStore from "./stores/status-store";
import PingPongStore from "./stores/pingpong-store.js";
import Events from "./components/events";
import NewEvent from "./components/new-event";
import Header from "./components/header";
import {render} from "react-dom";
import ConnectMQTT from "./components/connect-mqtt";

import MQTTApp from "./rpc";

let app;

class App extends Component {
  static getStores(){
    return [
      ErrorStore,
      EventStore,
      StatusStore,
      PingPongStore,
    ];
  }
  static calculateState(state){
    return {
      error: ErrorStore.getState(),
      events: EventStore.getState(),
      status: StatusStore.getState(),
      pingpong: PingPongStore.getState(),
    };
  }
  constructor(props){
    super(props);
    this.state = {
      isConnectingMQTT: false,
      broker: null,
      prefix: null
    };
  }
  componentDidMount(){
    setTimeout(()=>{
      EventAction.fetchAll();
    }, 100);
  }
  handleOnConnectMQTT(ev, prefix, broker){
    ev.preventDefault();
    this.onConnectMQTT(prefix, broker);
  }
  onConnectMQTT(prefix, broker){
    app = new MQTTApp({prefix});
    app.listen(broker);
    app.connect(broker);
    app.on("connect", ()=>{
      this.setState({
        isConnectingMQTT: true,
        broker: broker,
        prefix: prefix
      });
    });
    app.on("error", (err)=>{
      alert(err.message);
      this.setState({
        isConnectingMQTT: false,
        broker: null,
        prefix: null
      });
    });
  }
  render (){
    // console.info(this.state);
    return <div>
      <Header app={app} data={this.state} onConnectMQTT={this.onConnectMQTT.bind(this)}/>
      {!this.state.isConnectingMQTT && <ConnectMQTT onConnectMQTT={this.handleOnConnectMQTT.bind(this)} />}
      {React.cloneElement(this.props.children, {data: this.state, app})}
      </div>;
  }
};

const router = <Router history={hashHistory}>
        <Route path="/" component={Container.create(App)}>
        <IndexRoute component={Events} />
        <Route path="/events" >
          <IndexRoute component={Events} />
          <Route path="new" component={NewEvent} />
          <Route path=":id" component={EventDetail} />
        </Route>
        </Route>
  </Router>;
render(router, document.querySelector("#app"));
