import React, {Component} from "react";

import VoteBase from "./vote-base";

export default class VoteResult extends Component {
  render(){
    const {error, event, status, answers} = this.props.data;
    if(!event) return null;

    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    return <div className="container">
        <h1 style={{color: "#999", fontSize: "x-large"}}>{event.title}</h1>
        <div>
          <VoteBase event={event} status={status} answers={answers} />
        </div>
      </div>;
  }
}
