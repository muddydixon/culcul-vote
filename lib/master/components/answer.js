"use strict";

import React, {Component} from "react";

export default class Answer extends Component {
  summarize(votes = [], countType = "once"){
    if(countType === "once"){
      const ids = {};
      votes.forEach((v)=> ids[v.from] = v.time);
      return Object.keys(ids).length;
    }else{
      return votes.length;
    }
  }
  render (){
    const {answer, status, countType} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    const cnt = this.summarize(answer.votes, countType) || 0;
    const style = {
      display: "inline-block",
      height: 10,
      width: cnt,
      marginLeft: 10,
      background: "red"
    };
    return <div>
      <li>
      <h4>{type && type === "answer" ? <i className={`fa fa-${st}`} /> : null} {answer.title}
      <div style={style} />&nbsp;
      <span>{cnt}</span>
      </h4>
      </li>
    </div>;
  }
}
