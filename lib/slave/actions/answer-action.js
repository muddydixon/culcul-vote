"use strict";

import uuid from "uuid";
import dispatcher from "../../dispatcher";
import EventStore from "../stores/event-store";
import Const from "../../common/constants";

export default {
  vote(eventId, voteId, answerId, from, eventType){
    const event = EventStore.getState();
    if(!event) return Promise.reject(new Error(`event not found (${eventId})`));
    const vote = {
      from,
      eventType,
      time: Date.now()
    };

    if(event.votes[voteId].answerType === "simultaneous"){
      if(eventType !== "barup"){
        answerId = +eventType.replace(/button/, "") - 1;
        if(event.votes[voteId].answers[answerId]){
          event.votes[voteId].answers[answerId].votes.push(vote);
        }
      }else{
        return Promise.resolve(true);
      }
    }else{
      event.votes[voteId].answers[answerId].votes.push(vote);
    }
    dispatcher.dispatch({
      type: Const.VOTE_EVENT,
      voteId,
      answerId,
      answerType: event.votes[voteId].answerType,
      vote});
    return Promise.resolve(true);
  }
};
