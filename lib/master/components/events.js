"use strict";

import React, {Component} from "react";
import Event from "./event";

export default class Events extends Component {
  render (){
    const {events} = this.props.data;
    return <div className="container">
      {events.map((event) => <Event key={event.id} event={event} />)}
    </div>;
  }
}
