"use strict";

import React, {Component} from "react";
import Answers from "./answers";
import NewAnswer from "./new-answer";
import EventAction from "../actions/event-action";
import ErrorAction from "../../common/actions/error-action";

export default class Vote extends Component {
  onAddAnswer(answer){
    const {eventId, vote} = this.props;
    if(vote.answerType === "simultaneous" && vote.answers.length >= 3){
      return ErrorAction.error(new Error("ボタン押し分けでは4つ以上の回答を作成できません"));
    }
    return EventAction.addAnswer(this.props.app, eventId, vote.id, answer);
  }
  onDeleteVote(){
    const {eventId, vote} = this.props;
    EventAction.deleteVote(this.props.app, eventId, vote.id);
  }
  resetCounter(){
    const {eventId, vote} = this.props;
    EventAction.resetVote(this.props.app, eventId, vote.id);
  }
  render (){
    const {vote, status} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    return <div className="panel" id={`voteId-${voteId}`}>
      <h2 className="panel-heading">
      {type && type === "vote" ? <i className={`fa fa-${st}`} /> : null} {vote.title}
      <div className="row">
        <span>&nbsp;</span><button className="btn btn-warning">{vote.answerType === "sequence" ? "時間押し分け" : "ボタン押し分け"}</button>&nbsp;
        <span>&nbsp;</span><button className="btn btn-warning">{vote.countType === "multiple" ? "複数回答" : "最初の一回"}</button>&nbsp;
        <span>&nbsp;</span><button className="btn btn-danger" onClick={this.resetCounter.bind(this)}>リセット</button>&nbsp;
      </div>
      </h2>
      <div className="panel-body">
      <Answers status={status} vote={vote} app={this.props.app}/>
      {vote.answerType !== "simultaneous" || vote.answers.length < 3 ?
        <NewAnswer onSubmit={this.onAddAnswer.bind(this)} answerType={vote.answerType}/> : null
      }
      <div className="panel-footer" style={{background: "#FFF", borderTop: "none"}}>
        <span>&nbsp;</span><button className="text-right btn btn-danger" onClick={this.onDeleteVote.bind(this)}>削除</button>
      </div>
      </div>
      </div>;
  }
}
