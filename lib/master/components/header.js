"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  componentWillReceiveProps(nextProps){
    if(this.props.data.onConnectMQTT===false && nextProps.data.onConnectMQTT===true){
      this.timer = setInterval(() => {
          this.refreshConnect();
        }
        , Const.CONNACK_TIMER);
    }
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  refreshConnect(){
    if(this.mqttShouldConnect()){
      this.props.onConnectMQTT(this.props.data.prefix, this.props.data.broker);
    }
  }
  handleRefreshConnect(ev){
    ev.preventDefault();
    this.refreshConnect();
  }
  mqttShouldConnect(){
    if(!this.props.app){
      console.log("please confirm broker settings");
      return false;
    }
    if(!this.props.app._mqtt.connected) return false;
    if(this.props.data.onConnectMQTT===true){
      return false;
    }
    return true;
  }
  render(){
    const checked = this.props.data.onConnectMQTT;
    return (<header className="navbar navbar-static-top bs-docs-nav">
              <div className="container">
                <nav className="collapse navbar-collapse">
                  <ul className="nav navbar-nav" style={{width: "100%"}}>
                    <li><Link to="" className="navbar-brand">カルカル投票システム</Link></li>
                    <li><Link to="/">イベントリスト</Link></li>
                    <li><Link to="/events/new">イベント作成</Link></li>
                    <li>
                      <label className="switch">
                        <input id="mqtt-connection" type="checkbox" checked={checked||false} />
                        <div className="slider" onClick={(ev) => this.handleRefreshConnect(ev)} />
                      </label>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
