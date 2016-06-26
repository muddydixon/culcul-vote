"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

export default class Event extends Component {
  render (){
    const {event} = this.props;
    return <div className="row-fluid">
      <Link to={`/events/${event.id}`}>{event.title}</Link>
      &nbsp;(<a href={`/slave.html?id=${event.id}`}><i className="fa fa-link" /> 結果ページ表示</a>)
    </div>;
  }
}
