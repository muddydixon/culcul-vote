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
    // participants = voters ^ exists
    const exists = pingpong.map((exist)=>exist.from);
    const participants = _.uniq(voters.concat(exists));
    const winners = [];
    const winnerNum = Math.min(participants.length, +(this.refs.winnerNum.value.trim() || 0));
    console.log(`${winnerNum} bars will be selected in ${participants.length}`);
    while(winners.length < winnerNum){
      const r = 0|Math.random() * participants.length;
      const winner = participants[r];
      participants.splice(r, 1);
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
        <input className="form-control"　style={{display: "inline-block"}} type="text" defaultValue="1" ref="winnerNum" />
      </div>
      <div className="col-md-8">
        <button className={`btn btn-danger ${isLotting ? "disabled": ""}`}　style={{display: "inline-block"}} onClick={this.drawLot.bind(this)}>{isLotting ? "くじ処理中" : "くじを引く"}</button>&nbsp;
        <button className="btn btn-success" onClick={this.offLot.bind(this)}>消灯</button>&nbsp;
      </div>
    </div>;
  }
};
