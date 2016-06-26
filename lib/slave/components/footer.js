"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Footer extends Component {
  render(){
    const {event} = this.props;
    if(!event) return null;
    return <footer className="footer" style={{position: "absolute", bottom: 0, width: "100%"}}>
      <div className="container text-center">
      <img src="./assets/images/nifty-logo.png" style={{display: "inline-block"}}/>
      </div>
      </footer>;
  }
};
