"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  _connack(){

  }
  componentWillMount(){
    this.timer = setInterval(() => {
        this.connected = this.props.app._mqtt.connected;
      }
     , Const.CONNACK_TIMER);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
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
                        <input id="toggle-trigger" type="checkbox" data-toggle="toggle" />
                        <div className="slider" onClick={(ev) => this.toggle(ev)} />
                      </label>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
