import _ from "lodash";
import React, {Component} from "react";
import EventAction from "../actions/event-action";

export default class Lot extends Component {
  drawLot(){
    const event = this.props.event;
    const voters = _.uniq(
      _.flattenDeep(event.votes.map(vote => vote.answers.map(answer => answer.votes.map(v => v.from)))));

    const winners = [];
    const winnerNum = Math.min(voters.length, +(this.refs.winnerNum.value.trim() || 0));
    while(winners.length < winnerNum){
      const winner = voters[0|Math.random() * voters.length];
      if(winners.indexOf(winner) >= 0) return;
      winners.push(winner);
    }
    console.log(`lot for all ${winners.join(", ")}`);
    winners.forEach(winnerId => {
      EventAction.lot(this.props.app, event.id, winnerId);
    });
  }
  render(){
    return <div style={{display: "inline-block"}}>
      <input style={{display: "inline-block"}} className="form-control" type="text" defaultValue="1" ref="winnerNum" />
      <a style={{display: "inline-block"}} target="_blank" className="btn btn-danger" onClick={this.drawLot.bind(this)}>くじを引く</a>
      </div>;
  }
};
