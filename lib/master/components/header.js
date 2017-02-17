"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Header extends Component {
  render(){
    return (<header className="navbar navbar-static-top bs-docs-nav">
              <div className="container">
                <Link to="" className="navbar-brand">カルカル投票システム</Link>
                <nav className="collapse navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li><Link to="/">イベントリスト</Link></li>
                    <li><Link to="/events/new">イベント作成</Link></li>
                  </ul>
                </nav>
              </div>
            </header>);
  }
};
