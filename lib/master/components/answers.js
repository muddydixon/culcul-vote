"use strict";

import React, {Component} from "react";
import Answer from "./answer";

export default class Answers extends Component {
  render (){
    const {vote, status} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    return <div className="container">
      <ol>
      {vote.answers.map((answer, id)=>
                        <Answer
                        key={id}
                        vote={vote}
                        answer={answer}
                        answerId={id}
                        countType={vote.countType}
                        status={vote.answerType === "simultaneous" || id === +answerId ? status : null}
                        app={this.props.app}
                        />)}
      </ol>
      </div>;
  }
}
