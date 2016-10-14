import _ from "lodash";
import React, {Component} from "react";
import EventAction from "../actions/event-action";

export default class Lot extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLotting: false
    };
  }
  drawLot(){
    if(this.state.isLotting) return;
    console.group("lot");
    this.setState({isLotting: true});
    const event = this.props.event;
    const voters = _.uniq(
      _.flattenDeep(event.votes.map(vote => vote.answers.map(answer => answer.votes.map(v => v.from)))));
    console.log(voters.length);
    const winners = [];
    const winnerNum = Math.min(voters.length, +(this.refs.winnerNum.value.trim() || 0));
    console.log(`${winnerNum} bars`);
    while(winners.length < winnerNum){
      const r = 0|Math.random() * voters.length;
      const winner = voters[r];
      voters.splice(r, 1);
      if(winners.indexOf(winner) >= 0) return;
      winners.push(winner);
    }
    console.log(`winners are [${winners.sort().join(", ")}](${winners.length})`);
    winners.forEach(winnerId => {
      EventAction.lot(this.props.app, event.id, winnerId);
    });
    this.setState({isLotting: false});
    console.groupEnd("lot");
  }
  render(){
    const isLotting = this.state.isLotting;
    return <div className="row" style={{display: "inline-block"}}>
      <div className="col-md-4">
      <input style={{display: "inline-block"}} className="form-control" type="text" defaultValue="1" ref="winnerNum" />
      </div>
      <div className="col-md-8">
      <a style={{display: "inline-block"}} target="_blank" className={`btn btn-danger ${isLotting ? "disabled": ""}`} onClick={this.drawLot.bind(this)}>{isLotting ? "くじ処理中" : "くじを引く"}</a>
      </div>
      </div>;
  }
};


// <div class="input-group">
//       <input type="text" class="form-control" placeholder="Search for...">
//       <span class="input-group-btn">
//         <button class="btn btn-default" type="button">Go!</button>
//       </span>
//     </div>
