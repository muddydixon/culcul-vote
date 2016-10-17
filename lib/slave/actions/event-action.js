"use strict";

import uuid from "uuid";
import dispatcher from "../../dispatcher";
import EventStore from "../stores/event-store";
import Const from "../../common/constants";

export default {
  fetch(app, eventId){
    if(!app) return Promise.reject();
    return new Promise((resolve, reject)=>{
      app.send(`${Const.TOPICS.EVENTS}`, {eventId: eventId}).then((res)=>{
        if(!res.data.event) return reject(new Error("該当のイベントはありません"));
        dispatcher.dispatch({type: Const.FETCH_EVENT, event: res.data.event});
        return resolve(res.event);
      });
    }).catch((err)=>{
      dispatcher.dispatch({type: Const.ERROR, error: err});
    });
  },
  update(event){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: Const.FETCH_EVENT, event});
      resolve(event);
    });
  },
  summarize(vote, answerId){
    if(!vote) return 0;
    if(typeof answerId === "undefined") return 0;
    if(!vote.answers[answerId]) return 0;
    const votes = vote.answers[answerId].votes;
    if(!votes) return 0;
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
