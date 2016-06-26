"use strict";

import mqttpress from "mqttpress";
import StatusStore from "./stores/status-store";
import StatusAction from "./actions/status-action";
import EventAction from "./actions/event-action";
import AnswerAction from "./actions/answer-action";

module.exports = (opts)=>{
  const app = mqttpress(opts);
  app.hear(`status`, (res)=>{
    StatusAction.status(res.data.status);
  });
  app.hear(`event/update`, (res)=>{
    EventAction.update(res.data.event);
  });

  app.hear(`vote`, (res)=>{
    const status = StatusStore.getState();
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    if(type === "answer" && st === "play"){
      AnswerAction.vote(eventId, +voteId, +answerId, res.from, res.data.eventType);
    }
  });

  return app;
};
