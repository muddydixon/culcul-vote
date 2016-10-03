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
  render (){
    const {vote, status} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    console.log(vote.answerType, vote.answers);

    return <div className="panel">
      <h2 className="panel-heading">
      {type && type === "vote" ? <i className={`fa fa-${st}`} /> : null} {vote.title}
      <span>&nbsp;</span><button className="btn btn-warning">{vote.answerType === "sequence" ? "時間押し分け" : "ボタン押し分け"}</button>
      <span>&nbsp;</span><button className="btn btn-warning">{vote.countType === "multiple" ? "複数回答" : "最初の一回"}</button>
      </h2>
      <div className="panel-body">
      <Answers status={status} vote={vote} app={this.props.app}/>
      {vote.answerType !== "simultaneous" || vote.answers.length < 3 ?
        <NewAnswer onSubmit={this.onAddAnswer.bind(this)} answerType={vote.answerType}/> : null
      }
      </div>
      </div>;
  }
}
