"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Header extends Component {
  render(){
    const {event} = this.props;
    if(!event) return null;
    return (<header className="navbar navbar-static-top bs-docs-nav" style={{height: 50,marginTop: 30}}>
            <div className="container" style={{height: 50, lineHeight: "80px", background: "white"}}>
              <a href="../" className="navbar-brand" style={{padding: 0}}>
                <img height="50px" src="./assets/images/culcul-logo.gif" />
              </a>
            <div className="text-right" style={{lineHeight: "50px", fontFamily: "Muli, sans-serif", letterSpacing: "3px"}}>
                <h4 style={{display: "inline-block"}}>System Sponsored By&nbsp;</h4>
                 <a href="../"><img height="50px" src={(event.sponsor || {}).banner || "./assets/images/iot-dc.jpg"} /></a>
                 </div>
              </div>
            </header>);
  }
};
