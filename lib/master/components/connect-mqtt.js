"use strict";

import React, {Component} from "react";

export default class ConnectMQTT extends Component {
  render (){
      return <form className="container">
        <div className="form-group">
          <label htmlFor="event-broker">ブローカー設定</label>
          <input className="form-control" id="event-broker" ref="broker" defaultValue="ws://192.168.99.100:9001" />
        </div>
        <div className="form-group">
          <label htmlFor="event-prefix">ブローカー Prefix (任意)</label>
          <input className="form-control" id="event-prefix" ref="prefix" placeholder="Event Prefix" />
        </div>
      <button className="btn btn-info" onClick={(ev)=>{
        this.props.onConnectMQTT(ev, this.refs.prefix.value.trim(), this.refs.broker.value.trim());
      }}>接続</button>
      </form>;
  }
};
