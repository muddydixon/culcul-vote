"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import Votes from "./votes";
import _ from "lodash";
import EventAction from "../actions/event-action";
import StatusAction from "../actions/status-action";
import PingPongAction from "../actions/pingpong-action";
import NewVote from "./new-vote";
import Lot from "./lot";

export default class EventDetail extends Component {
  constructor(props){
    super(props);
    this.keyForward = this.keyForward.bind(this);
  }
  componentWillMount(){
    StatusAction.reset(this.props.params.id);
    document.addEventListener("keydown", this.keyForward, false);
  }
  keyForward(ev){
    if(ev.code === "ArrowRight" || ev.key === "ArrowRight" || ev.keyCode === 39){
      this.forward();
    }
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyForward, false);
  }
  onAddVote(title, answerType, countType, displayType, answers){
    return EventAction.addVote(this.props.app, this.props.params.id, title, answerType, countType, displayType, answers);
  }
  forward(){
    const {events} = this.props.data;
    const event = events.find((e)=> e.id === this.props.params.id);
    const nextStatus = StatusAction.forward(this.props.app, event);
  }
  backward(){
    const {events} = this.props.data;
    const event = events.find((e)=> e.id === this.props.params.id);
    const nextStatus = StatusAction.backward(this.props.app, event);
  }
  ping(){
    PingPongAction.ping(this.props.app);
  }
  render (){
    const {events, status, pingpong, broker, prefix} = this.props.data;
    const event = events.find((e)=> e.id === this.props.params.id);
    const num_exists = pingpong ? pingpong.length : 0;
    if(!event) return null;
    const [type, evId, voteId, answerId, st] = status.split("/");

    return <div className="container">
      <nav className="page-header affix-top">
      <div className="row">
        <h1 className="col-md-4">
        {type && type === "event" ? <i className={`fa fa-${st}`}>&nbsp;</i> : null}
          {event.title}&nbsp;
        </h1>
        <div className="col-md-2">
          <button className="btn btn-info" onClick={this.backward.bind(this)}>戻る</button>&nbsp;
          <button className="btn btn-info" onClick={this.forward.bind(this)}>進む</button>&nbsp;
        </div>
        <div className="col-md-4">
          <Lot app={this.props.app} event={event} pingpong={pingpong} />
          <div className="row" style={{display: "inline-block", width: "100%"}}>
            <div className="col-md-4">
              <input style={{display: "inline-block"}} className="form-control" type="text" value={num_exists}/>
            </div>
            <div className="col-md-8">
              <button className="btn btn-info" onClick={this.ping.bind(this)}>存在確認</button>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="row" style={{display: "inline-block"}}>
            <a target="_blank" className="btn btn-success" href={`./slave.html?id=${event.id}&broker=${broker}&prefix=${prefix}`}>公開ページ</a>&nbsp;
          </div>
        </div>
      </div>
      </nav>
      <div className="row" style={{display: "inline-block"}}>
        <div style={{marginTop: 100}}>
          <Votes status={status} votes={event.votes} eventId={event.id} app={this.props.app}/>
          <NewVote onSubmit={this.onAddVote.bind(this)}/>
        </div>
      </div>
    </div>;
  }
}