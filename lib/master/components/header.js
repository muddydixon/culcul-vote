"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Const from "../../common/constants";

export default class Header extends Component {
  componentWillMount(){
    this.timer = setInterval(() => {
        console.log("connect", this.connected);
        this.connected = (!this.props.app) ? false : this.props.app._mqtt.connected;
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
    }else{
      console.log("connect process");
      // completed => set value and checked.
    }
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
