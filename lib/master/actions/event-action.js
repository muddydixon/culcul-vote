"use strict";

import dispatcher from "../../dispatcher";
import events from "../data";
import uuid from "uuid";

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
      events.push(event);
      dispatcher.dispatch({type: "CREATE_EVENT", event: event});
      resolve(events);
    });
  },
  fetchAll(){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: "FETCH_EVENTS", events: events});
      resolve(events);
    });
  },
  addVote(app, eventId, voteTitle, answerType, countType, displayType){
    return new Promise((resolve, reject)=>{
      const event = events.find((e)=> e.id === eventId);
      const vote = {
        id: uuid().substr(0, 8),
        title:       voteTitle,
        answerType:  answerType  || "sequence",
        countType:   countType   || "once",
        displayType: displayType || "realtime",
        answers: []
      };
      event.votes.push(vote);
      dispatcher.dispatch({type: "APPEND_VOTE", events: [].concat(events)});
      resolve(events);
      console.log("vote", event);
      app.send(`event/update`, {event});
    });
  },
  addAnswer(app, eventId, voteId, answerTitle){
    return new Promise((resolve, reject)=>{
      const event = events.find((e)=> e.id === eventId);
      const vote = event.votes.find((v)=> v.id === voteId);
      const answer = {
        title: answerTitle,
        votes: []
      };
      vote.answers.push(answer);
      dispatcher.dispatch({type: "APPEND_ANSWER", events: [].concat(events)});
      resolve(events);
      console.log("answer", event);
      app.send(`event/update`, {event});
    });
  },
  vote(eventId, voteId, answerId, from, eventType){
    const event = events.find((e)=> e.id === eventId);
    if(!event) return Promise.reject(new Error(`event not found (${eventId})`));

    if(event.votes[voteId].answerType === "simultaneous"){
      if(eventType !== "barup"){
        const buttonId = +eventType.replace(/button/, "");
        if(event.votes[voteId].answers[buttonId - 1]){
          event.votes[voteId].answers[buttonId - 1].votes.push({from, eventType, time: Date.now()});
        }
      }
    }else{
      event.votes[voteId].answers[answerId].votes.push({from, eventType, time: Date.now()});
    }
    dispatcher.dispatch({type: "EVENT_VOTE", events: [].concat(events)});
    return Promise.resolve(true);
  },
  lot(app, eventId, barId){
    app.send(`event/lot`, {
      id: barId,
      color: "#FFFFFF",
      eventType: "on"
    });
  }
};
