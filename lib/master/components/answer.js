import React, {Component} from "react";
import _ from "lodash";
import EventAction from "../actions/event-action";

export default class Answer extends Component {
  onLightOn(ev){
    const {answer, status, countType} = this.props;
    console.group(`lighton for answer ${answer.title}`);
    const ids = _.uniq(answer.votes.map(v => v.from));
    console.log(`ids [${ids.join(", ")}] (${ids.length})`);
    ids.forEach(id => {
      EventAction.lot(this.props.app, null, id);
    });
    console.groupEnd("lighton for answer");
  }
  onLightOff(ev){
    const {answer, status, countType} = this.props;
    console.group(`lightoff for answer ${answer.title}`);
    const ids = _.uniq(answer.votes.map(v => v.from));
    ids.forEach(id => {
      EventAction.lotOff(this.props.app, null, id);
    });
    console.groupEnd("lightoff for answer");
  }
  render (){
    const {answer, vote, status, answerId, countType} = this.props;
    const [type, eventId, voteId, aId, st] = status ? status.split("/") : [];
    const cnt = EventAction.summarize(vote, answerId) || 0;
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
      <button className="btn btn-danger btn-sm" onClick={this.onLightOff.bind(this)}>消灯</button>&nbsp;
      <h4 style={{display: "inline-block"}}>{type && type === "answer" ? <i className={`fa fa-${st}`} /> : null} {answer.title}
      <div style={style} />&nbsp;
      <span>{cnt}</span>
      </h4>
      </li>
    </div>;
  }
}
