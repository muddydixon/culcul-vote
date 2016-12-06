import _ from "lodash";
import React, {Component} from "react";
import EventAction from "../actions/event-action";

export default class Lot extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLotting: false,
      winners: []
    };
  }
  drawLot(){
    if(this.state.isLotting) return;
    console.group("lot");
    this.setState({isLotting: true});
    const event = this.props.event;
    const pingpong = this.props.pingpong;
    const voters = _.uniq(
      _.flattenDeep(event.votes.map(vote => vote.answers.map(answer => answer.votes.map(v => v.from)))));
    console.log(voters);
    // participant = voters ^ exists
    const exists = pingpong.map((exist)=>exist.from);
    console.log(exists);
    // const participant = voters.push.apply(voters,exists);
    // participant = participant.filter((a,i,self)=>self.indexOf(x)===i);
    const participant = voters.concat(exists);
    console.log(participant);
    console.log(_.uniq(participant));
    const winners = [];
    const winnerNum = Math.min(participant.length, +(this.refs.winnerNum.value.trim() || 0));
    console.log(`${winnerNum} bars will be selected in ${participant.length}`);
    while(winners.length < winnerNum){
      const r = 0|Math.random() * participant.length;
      const winner = participant[r];
      participant.splice(r, 1);
      if(winners.indexOf(winner) >= 0) return;
      winners.push(winner);
    }
    console.log(`winners are [${winners.sort().join(", ")}](${winners.length})`);
    winners.forEach(winnerId => {
      EventAction.lot(this.props.app, event.id, winnerId);
    });
    this.setState({
      isLotting: false,
      winners
    });
    console.groupEnd("lot");
  }
  offLot(){
    console.group("lotoff");
    console.log(`[${this.state.winners.join(", ")}]`);
    const event = this.props.event;
    this.state.winners.forEach(winnerId =>{
      EventAction.lotOff(this.props.app, event.id, winnerId);
    });
    this.setState({
      winners: []
    });
    console.groupEnd("lotoff");
  }
  render(){
    const isLotting = this.state.isLotting;
    return <div className="row" style={{display: "inline-block"}}>
      <div className="col-md-4">
      <input style={{display: "inline-block"}} className="form-control" type="text" defaultValue="1" ref="winnerNum" />
      </div>
      <div className="col-md-8">
        <button style={{display: "inline-block"}} className={`btn btn-danger ${isLotting ? "disabled": ""}`} onClick={this.drawLot.bind(this)}>{isLotting ? "くじ処理中" : "くじを引く"}</button>&nbsp;
        <button className="btn btn-success" onClick={this.offLot.bind(this)}>消灯</button>&nbsp;
      </div>
      </div>;
  }
};
