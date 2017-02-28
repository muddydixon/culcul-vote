"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  componentWillReceiveProps(nextProps){
    if(!this.props.app) return;
    if(this.props.app._mqtt.connected===false && nextProps.app._mqtt.connected===true){
      this.timer = setInterval(() => {
          this.refreshConnection();
        }
        , Const.CONNACK_TIMER);
    }
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  refreshConnection(){
    if(!this.isConnectMQTT()){
      this.props.onConnectMQTT(this.props.data.prefix, this.props.data.broker);
    }
  }
  handleRefreshConnection(ev){
    ev.preventDefault();
    this.refreshConnection();
  }
  isConnectMQTT(){
    if(!this.props.app){
      console.log("please confirm broker settings");
      return false;
    }
    return (!this.props.app._mqtt.connected)?false:this.props.app._mqtt.connected;
  }

  render(){
    const checked = this.isConnectMQTT();
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
                        <div className="slider" onClick={(ev) => this.handleRefreshConnection(ev)} />
                      </label>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
