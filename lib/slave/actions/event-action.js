"use strict";

import uuid from "uuid";
import dispatcher from "../../dispatcher";
import EventStore from "../stores/event-store";

export default {
  fetch(app, eventId){
    if(!app) return Promise.reject();
    return new Promise((resolve, reject)=>{
      app.send(`events`, {eventId: eventId}).then((res)=>{
        dispatcher.dispatch({type: "FETCH_EVENT", event: res.data.event});
        console.log(res.event);
        resolve(res.event);
      });
    });
  },
  update(event){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: "FETCH_EVENT", event});
      resolve(event);
    });
  }
};
