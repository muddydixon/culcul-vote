"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  componentWillMount(){
    this.timer = setInterval(() => {
        this.connected = (!this.props.app) ? false : this.props.app._mqtt.connected;
        if(document.getElementById('toggle-trigger').value!==this.connected){
          this.toggle.bind(this);
        }
      }
     , Const.CONNACK_TIMER);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  componentWillUpdate(){
    document.getElementById('toggle-trigger').value = this.connected;
    document.getElementById('toggle-trigger').checked = this.connected;
  }
  toggle(ev){
    if(document.getElementById('toggle-trigger').value==='true'){
      ev.preventDefault();
      return;
    }
    if(!this.props.app){
      console.log("please confirm broker settings");
      return;
    }
    this.props.app.connect(`${this.props.app._mqtt.protocol}://${this.props.app._mqtt.host}`);
    this.props.app.on("connect", () => {
      document.getElementById('toggle-trigger').value = true;
      document.getElementById('toggle-trigger').checked = true;
    });
    this.props.app.on("error", (err) => {
      alert(err.message);
      document.getElementById('toggle-trigger').value = false;
      document.getElementById('toggle-trigger').checked = false;
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
                        <input id="toggle-trigger" type="checkbox" value={this.connected} />
                        <div className="slider" onClick={(ev) => this.toggle(ev)} />
                      </label>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
