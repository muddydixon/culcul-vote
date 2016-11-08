"use strict";

import _ from "lodash";
import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import events from "../data";
import Const from "../../common/constants";

const getButtonId = (eventType)=>{
  if(eventType.indexOf("button") === 0){
    const buttonId = eventType.replace(/button/, "");
    return +buttonId - 1;
  }
  return -1;
};

class EventStore extends ReduceStore {
  getInitialState(){
    return events;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.FETCH_EVENTS:
      return state;
    case Const.CREATE_EVENT:
      events.push(action.event);
      return events.map(event => event);

    case Const.APPEND_VOTE:
      {
        const event = events.find(ev => ev.id === action.eventId);
        event.votes.push(action.vote);
        action.app.send(`${Const.TOPICS.EVENT_UPDATE}`, {event});
      }
      return events.map(event => event);
    case Const.DELETE_VOTE:
      {
        const event = events.find(ev => ev.id === action.eventId);
        event.votes = event.votes.filter((v)=> v.id !== action.voteId);
        action.app.send(`${Const.TOPICS.EVENT_UPDATE}`, {event});
      }
      return events.map(event => event);
    case Const.RESET_VOTE:
      {
        const event = events.find(ev => ev.id === action.eventId);
        const vote = event.votes.find(v => v.id === action.voteId);
        vote.ids = {};
        vote.answers.forEach(answer => answer.votes = []);
        action.app.send(`${Const.TOPICS.EVENT_UPDATE}`, {event});
      }
      return events.map(event => event);
    case Const.APPEND_ANSWER:
      {
        const event = events.find(ev => ev.id === action.eventId);
        const vote = event.votes.find(v => v.id === action.voteId);
        vote.answers.push(action.answer);
        action.app.send(`${Const.TOPICS.EVENT_UPDATE}`, {event});
      }
      return events.map(event => event);

    case Const.VOTE_EVENT:
      {
        const {eventId, voteId, answerId, from, eventType} = action;
        const event = events.find(ev => ev.id === eventId);
        const vote = event.votes[+voteId];
        const answer = vote.answers[+answerId];
        const {answerType, countType} = vote;
        vote.ids = vote.ids || {};

        if(countType === "once" && answerType === "simultaneous"){
          // 一度 && 同時押し分け
          if(from in vote.ids) return state;
          const buttonId = getButtonId(eventType);
          if(buttonId < 0) return state;
          if(!vote.answers[buttonId]) return state;
          vote.answers[buttonId].votes.push({from, eventType, time: Date.now()});
          vote.ids[from] = {from, eventType};
          if(event.uniqIdList.indexOf(from) === -1) event.uniqIdList.push(from);
          event.uniqIdList = _.shuffle(event.uniqIdList);
          return events.map(event => event);

        }else if(countType === "once" && answerType === "sequence"){
          // 一度 && 時刻押し分け
          if(from in vote.ids) return events.map(event => event);
          answer.votes.push({from, eventType, time: Date.now()});
          vote.ids[from] = {from, eventType};
          if(event.uniqIdList.indexOf(from) === -1) event.uniqIdList.push(from);
          event.uniqIdList = _.shuffle(event.uniqIdList);
          return events.map(event => event);

        }else if(countType === "multiple" && answerType === "simultaneous"){
          // 複数 && 同時押し分け
          const buttonId = getButtonId(eventType);
          if(buttonId < 0) return state;
          if(!vote.answers[buttonId]) return state;
          vote.answers[buttonId].votes.push({from, eventType, time: Date.now()});
          if(event.uniqIdList.indexOf(from) === -1) event.uniqIdList.push(from);
          event.uniqIdList = _.shuffle(event.uniqIdList);
          return events.map(event => event);

        }else if(countType === "multiple" && answerType === "sequence"){
          // 複数 && 時刻押し分け
          answer.votes.push({from, eventType, time: Date.now()});
          if(event.uniqIdList.indexOf(from) === -1) event.uniqIdList.push(from);
          event.uniqIdList = _.shuffle(event.uniqIdList);
          return events.map(event => event);
        }
      }
      return events.map(event => event);
    default:
      return state;
    }
  }
}

export default new EventStore(dispatcher);
