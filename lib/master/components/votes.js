"use strict";

import React, {Component} from "react";
import Vote from "./vote";

export default class Votes extends Component {
  render (){
    const {votes, status, eventId} = this.props;
    const [type, evId, voteId, answerId, st] = status.split("/");

    return <div className="container">
      {votes.map((vote, id) => <Vote key={vote.id} status={id === +voteId ? status : null} vote={vote} eventId={eventId} app={this.props.app}/>)}
    </div>;
  }
}
