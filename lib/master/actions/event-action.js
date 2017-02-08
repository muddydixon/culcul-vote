"use strict";

import dispatcher from "../../dispatcher";
import uuid from "uuid";
import _ from "lodash";
import Const from "../../common/constants";

export default class EventAction{
  static create(data){
    return new Promise((resolve, reject)=>{
      const id = uuid().substr(0, 8);
      const event = {
        id: id,
        title: data.title,
        sponsor: {
          name: data.sponsor.name || "",
          banner: data.sponsor.banner || ""
        },
        uniqIdList: [],
        votes: []
      };
      dispatcher.dispatch({type: Const.CREATE_EVENT, event: event});
      resolve(data);
    });
  }

  static fetchAll(){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: Const.FETCH_EVENTS});
    });
  }

  static addVote(app, eventId, voteTitle, answerType, countType, displayType, answers = []){
    return new Promise((resolve, reject)=>{
      const vote = {
        id: uuid().substr(0, 8),
        title:       voteTitle,
        answerType:  answerType  || "sequence",
        countType:   countType   || "once",
        displayType: displayType || "batch",
        answers: []
      };
      dispatcher.dispatch({type: Const.APPEND_VOTE, app, eventId, vote});
      resolve(vote);
      return vote;
    }).then((vote)=>{
      answers.forEach((answer, id)=>{
        this.addAnswer(app, eventId, vote.id, answer || id);
      });
      return vote;
    });
  }

  static deleteVote(app, eventId, voteId){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: Const.DELETE_VOTE, app, eventId, voteId});
      resolve();
    });
  }

  static resetVote(app, eventId, voteId){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: Const.RESET_VOTE, app, eventId, voteId});
      resolve();
    });
  }

  static addAnswer(app, eventId, voteId, answerTitle){
    return new Promise((resolve, reject)=>{
      const answer = {
        title: answerTitle,
        votes: []
      };
      dispatcher.dispatch({type: Const.APPEND_ANSWER, app, eventId, voteId, answer});
      resolve();
    });
  }

  static vote(eventId, voteId, answerId, from, eventType){
    dispatcher.dispatch({type: Const.VOTE_EVENT, eventId, voteId, answerId, from, eventType});
    return Promise.resolve(true);
  }

  static lot(app, eventId, barId){
    app.send(`${Const.TOPICS.EVENT_LIGHT}`, {
      id: barId,
      color: "#FFFFFF",
      eventType: "blink_on"
    });
  }

  static lotOff(app, eventId, barId){
    app.send(`${Const.TOPICS.EVENT_LIGHT}`, {
      id: barId,
      eventType: "blink_off"
    });
  }

  static summarize(vote, answerId){
    if(typeof answerId === "undefined") return 0;
    const votes = vote.answers[answerId].votes;
    const countType = vote.countType;

    if(countType === "once"){
      const aids = {};
      votes.forEach((v)=> aids[v.from] = v.time);
      return Object.keys(aids).length;
    }else{
      return votes.length;
    }
  }
};
