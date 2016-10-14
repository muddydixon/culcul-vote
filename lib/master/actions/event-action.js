"use strict";

import dispatcher from "../../dispatcher";
import uuid from "uuid";
import _ from "lodash";

export default {
  create(data){
    return new Promise((resolve, reject)=>{
      const id = uuid().substr(0, 8);
      const event = {
        id: id,
        title: data.title,
        sponsor: {
          name: data.sponsor.name || "",
          banner: data.sponsor.banner || ""
        },
        votes: []
      };
      dispatcher.dispatch({type: "CREATE_EVENT", event: event});
      resolve(data);
    });
  },
  fetchAll(){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: "FETCH_EVENTS"});
    });
  },
  addVote(app, eventId, voteTitle, answerType, countType, displayType, answers = []){
    return new Promise((resolve, reject)=>{
      const vote = {
        id: uuid().substr(0, 8),
        title:       voteTitle,
        answerType:  answerType  || "sequence",
        countType:   countType   || "once",
        displayType: displayType || "batch",
        answers: []
      };
      dispatcher.dispatch({type: "APPEND_VOTE", app, eventId, vote});
      resolve(vote);
      return vote;
    }).then((vote)=>{
      answers.forEach((answer, id)=>{
        this.addAnswer(app, eventId, vote.id, answer || id);
      });
      return vote;
    });
  },
  deleteVote(app, eventId, voteId){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: "DELETE_VOTE", app, eventId, voteId});
      resolve();
    });
  },
  resetVote(app, eventId, voteId){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: "RESET_VOTE", app, eventId, voteId});
      resolve();
    });
  },
  addAnswer(app, eventId, voteId, answerTitle){
    return new Promise((resolve, reject)=>{
      const answer = {
        title: answerTitle,
        votes: []
      };
      dispatcher.dispatch({type: "APPEND_ANSWER", app, eventId, voteId, answer});
      resolve();
    });
  },
  vote(eventId, voteId, answerId, from, eventType){
    dispatcher.dispatch({type: "EVENT_VOTE", eventId, voteId, answerId, from, eventType});
    return Promise.resolve(true);
  },
  lot(app, eventId, barId){
    app.send(`event/lot`, {
      id: barId,
      color: "#FFFFFF",
      eventType: "on"
    });
  },
  summarize(vote, answerId){
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
