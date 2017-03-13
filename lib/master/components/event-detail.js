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
import Scroll from "../../scroll";
import Const from "../../common/constants";

export default class EventDetail extends Component {
  constructor(props){
    super(props);
    this.keyEvent = this.keyEvent.bind(this);
  }
  componentWillMount(){
    StatusAction.reset(this.props.params.id);
    document.addEventListener("keydown", this.keyEvent, false);
  }
  keyEvent(ev){
    if(ev.code === "ArrowRight" || ev.key === "ArrowRight" || ev.keyCode === 39){
      this.forward();
    }
    if(ev.code === "ArrowLeft" || ev.key === "ArrowLeft" || ev.keyCode === 37){
      this.backward();
    }
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyEvent, false);
  }
  componentDidUpdate(prevProps, prevState){
    const [type, evId, voteId, answerId, st] = this.props.data.status.split("/");
    if(type === "vote" && st === "play" && answerId === "-1"){
      const targetElement = document.getElementById(`voteId-${voteId}`);
      Scroll.scrollAnimation(targetElement,Const.SCROLL_SPEED);
      this.applyHighLight(targetElement);
    }
  }
  onAddVote(title, answerType, countType, displayType, answers){
    return EventAction.addVote(this.props.app, this.props.params.id, title, answerType, countType, displayType, answers);
  }
  forward(){
    const {events} = this.props.data;
    const event = events.find((e)=> e.id === this.props.params.id);
    const next = StatusAction.forward(this.props.app, event);
  }
  backward(){
    const {events} = this.props.data;
    const event = events.find((e)=> e.id === this.props.params.id);
    const next = StatusAction.backward(this.props.app, event);
  }
  applyHighLight(targetElement){
    const voteElements = document.getElementsByClassName("panel");
    for(let i = 0; i < voteElements.length; i++){
      if(voteElements[i].hasAttribute("id")){
        if(voteElements[i].id.includes("voteId-") && voteElements[i].classList.contains("high-light")){
          voteElements[i].classList.remove("high-light");
        }
      }
    }
    targetElement.classList.add("high-light");
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
      <h1 className="page-header affix-top">
        {type && type === "event" ? <i className={`fa fa-${st}`}>&nbsp;</i> : null}
        {event.title}&nbsp;
        <button className="btn btn-info" onClick={this.backward.bind(this)}>戻る</button>
        <button className="btn btn-info" onClick={this.forward.bind(this)}>進む</button>
        <Lot app={this.props.app} event={event} pingpong={pingpong} />
        <a target="_blank" className="btn btn-success" href={`./slave.html?id=${event.id}&broker=${broker}&prefix=${prefix}`}>公開ページ</a>
        <button className="btn btn-info sub-btn" onClick={this.ping.bind(this)}>存在確認</button>
        <input className="form-control" style={{display: "inline-block"}} type="text" value={num_exists}/>
      </h1>
      <div style={{marginTop: 100}}>
        <Votes status={status} votes={event.votes} eventId={event.id} app={this.props.app}/>
        <NewVote onSubmit={this.onAddVote.bind(this)}/>
      </div>
    </div>;
  }
}
