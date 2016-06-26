import React, {Component} from "react";

export default class VoteCount extends Component {
  renderResult(){
  }
  render(){
    const {event, status, answers} = this.props;
    if(!event) return null;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    if(type && type === "vote"){
      return this.renderProcess();
    }else{
      return this.renderResult();
    }
  }
};
