"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Header extends Component {
  render(){
    return (<header className="navbar navbar-static-top bs-docs-nav">
              <div className="container">
                <a href="../" className="navbar-brand">CulCul Vote System</a>
                <nav className="collapse navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li><Link to="/">List</Link></li>
                    <li><Link to="/events/new">CreateEvent</Link></li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
