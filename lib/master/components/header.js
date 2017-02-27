"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      connected: false,
    };
  }
  componentWillMount(){
    this.timer = setInterval(() => {
        this.refreshConnect();
      }
     , Const.CONNACK_TIMER);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  refreshConnect(){
    if(this.mqttShouldConnect()){
      this.tryMqttConnect().then(() => {
        this.setState({connected: true});
      }).catch(() => {
        this.setState({connected: false});
      });
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
    if(document.getElementById('mqtt-connection').checked===true){
      return false;
    }
    return true;
  }
  tryMqttConnect(){
    return new Promise((resolve, reject) => {
      this.props.app.connect(`${this.props.app._mqtt.options.protocol}://${this.props.app._mqtt.options.host}`);
      this.props.app.on("error", (err) => {
        alert(err.message);
        reject();
        return;
      });
      this.props.app.on("connect", () => {
        resolve();
        return;
      });
      setTimeout(() => {
        return reject();
      }, 1000);
    });
  }
  render(){
    return (<header className="navbar navbar-static-top bs-docs-nav">
              <div className="container">
                <nav className="collapse navbar-collapse">
                  <ul className="nav navbar-nav" style={{width: "100%"}}>
                    <li><Link to="" className="navbar-brand">カルカル投票システム</Link></li>
                    <li><Link to="/">イベントリスト</Link></li>
                    <li><Link to="/events/new">イベント作成</Link></li>
                    <li>
                      <label className="switch">
                        <input id="mqtt-connection" type="checkbox" checked={this.state.connected} />
                        <div className="slider" onClick={(ev) => this.handleRefreshConnect(ev)} />
                      </label>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
