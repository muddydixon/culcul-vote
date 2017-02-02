"use strict";

import events from "./data";
import mqttpress from "mqttpress";
import EventAction from "./actions/event-action";
import EventStore from "./stores/event-store";
import StatusStore from "./stores/status-store";
import PingPongAction from "./actions/pingpong-action";
import Const from "../common/constants";

module.exports = (opts)=>{
  const app = mqttpress(opts);

  app.on("listening", ()=>{
    console.log(`listen ${app.id}`);
  });

  app.hear(`${Const.TOPICS.EVENTS}`, (res)=>{
    const events = EventStore.getState();
    res.send({event: events.find((event)=> event.id === res.data.eventId)});
  });

  app.hear(`${Const.TOPICS.VOTE}`, (res)=>{
    const status = StatusStore.getState();
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    if(type === "answer" && st === "play" &&
       ["barup", "button1", "button2", "button3"].indexOf(res.data.eventType) >= 0){
      EventAction.vote(eventId, voteId, answerId, res.from, res.data.eventType);
    }
  });

  app.hear(`${Const.TOPICS.PONG}`, (res)=>{
    PingPongAction.pong(res.id, res.from, res.data.eventType);
  });

  return app;
};
