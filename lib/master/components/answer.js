import React, {Component} from "react";
import _ from "lodash";
import EventAction from "../actions/event-action";

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
  onLightOn(ev){
    const {answer, status, countType} = this.props;
    const ids = _.uniq(answer.votes.map(v => v.from));
    ids.forEach(id => {
      EventAction.lot(this.props.app, null, id);
    });
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
      <button className="btn btn-danger btn-sm" onClick={this.onLightOn.bind(this)}>点灯</button>&nbsp;
      <h4 style={{display: "inline-block"}}>{type && type === "answer" ? <i className={`fa fa-${st}`} /> : null} {answer.title}
      <div style={style} />&nbsp;
      <span>{cnt}</span>
      </h4>
      </li>
    </div>;
  }
}
