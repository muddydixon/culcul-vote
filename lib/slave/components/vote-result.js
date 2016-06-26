"use strict";

import React, {Component} from "react";

export default class VoteResult extends Component {
  summarize(votes = [], countType = "once"){
    if(countType === "once"){
      const ids = {};
      votes.forEach((v)=> ids[v.from] = v.time);
      return Object.keys(ids).length;
    }else{
      return votes.length;
    }
  }
  render(){
    const {event, status, answers} = this.props.data;
    if(!event) return null;

    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    const body = type && type === "vote" ?
            (st === "stop" ?
             <div><h2>{event.votes[+voteId].title} 結果表示</h2>
             <ol style="list-style-type: upper-latin">
             {event.votes[+voteId].answers.map((answer, id)=>{
               const cnt = this.summarize((answer && answer.votes) || [], event.votes[+voteId].countType) || 0;
               const style = {
                 display: "inline-block",
                 height: 30,
                 width: cnt * 2,
                 background: "yellow"
               };
               return <li key={id}>
                 <h2>{answer.title}</h2>
                 <div style={style} />&nbsp;
                 <h2 style={{display: "inline-block", fontFamily: "Muli, sans-serif"}}>{cnt}</h2>
                 </li>;
             })}
             </ol>
             </div> :
             <div><h2>{event.votes[+voteId].title}</h2></div>
            ) :
            (
              type && type === "answer" ?
                <div>
                <h2>{event.votes[+voteId].title}</h2>
                <ol style={{fontSize: "x-large", background: "white", padding: "5px 100px"}}>
                {event.votes[+voteId].answers.map((answer, id)=>{
                  if(event.votes[+voteId].answerType === "simultaneous"){
                    const statusLabel = st === "pause" ? "待機中" : st === "play" ? "投票中" : "投票完了";
                    return <li key={id}>
                      <h2>{answer.title}</h2>
                      <i className={`fa fa-${st}`} />&nbsp;{statusLabel}
                    </li>;
                  }else{
                    const statusIcon = +answerId === id ?
                            `fa fa-${st}` : +answerId > id ? "fa fa-stop" : "fa fa-pause";
                    const statusLabel = +answerId === id ?
                            (st === "pause" ? "待機中" : st === "play" ? "投票中" : "投票完了") :
                            +answerId > id ? "投票完了" : "投票前";
                    return <li key={id}>
                      <h2>{answer.title}</h2>
                      <i className={statusIcon} />
                      &nbsp;{statusLabel}
                    </li>;
                  }
                })}
                </ol>
                </div>: null
            );

    return <div className="container">
        <h1 style={{color: "#999", fontSize: "x-large"}}>{event.title}</h1>
        <div>
          {body}
        </div>
      </div>;
  }
}
